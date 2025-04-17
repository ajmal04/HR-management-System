const db = require("../models");
const User = db.user;
const OnboardingRequest = db.onboardingRequest;

exports.createRequest = async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.employeeId) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        // Check if employee exists
        const employee = await User.findByPk(req.body.employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const request = await OnboardingRequest.create({

            userId: req.body.employeeId,
            requestedBy: req.user.id
        });

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await OnboardingRequest.findAll({
            where: { status: 'pending' },
            include: [
                {
                    model: User,
                    as: 'employee',
                    attributes: ['id', 'full_name']
                },
                {
                    model: User,
                    as: 'requestedByUser',
                    attributes: ['id', 'full_name']
                }
            ],
            order: [['requestDate', 'ASC']]
        });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.completeOnboarding = async (req, res) => {
    try {
        const request = await OnboardingRequest.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await request.update({
            status: 'completed',
            completedBy: req.user.id,
            completionDate: new Date()
        });

        res.json({ 
            message: 'Onboarding marked complete',
            requestId: request.id,
            employeeId: request.employeeId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.bulkCompleteOnboarding = async (req, res) => {
    // Validate input
    if (!req.body.ids || !Array.isArray(req.body.ids)) {
        return res.status(400).json({ 
            success: false,
            message: 'Request must contain an array of IDs in the "ids" field'
        });
    }

    // Process IDs - remove duplicates and validate
    const requestIds = [...new Set(req.body.ids)]
        .map(id => parseInt(id))
        .filter(id => Number.isInteger(id) && id > 0);

    if (requestIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No valid request IDs provided'
        });
    }

    try {
        const result = await sequelize.transaction(async (t) => {
            // Update only pending requests
            const [affectedCount] = await OnboardingRequest.update(
                {
                    status: 'completed',
                    completedBy: req.user.id,
                    completionDate: sequelize.fn('NOW')
                },
                {
                    where: {
                        id: requestIds,
                        status: 'pending'
                    },
                    transaction: t,
                    lock: t.LOCK.UPDATE
                }
            );

            // Create audit log
            if (affectedCount > 0) {
                await AuditLog.create({
                    action: 'BULK_ONBOARDING_COMPLETE',
                    userId: req.user.id,
                    details: {
                        count: affectedCount,
                        requestIds: requestIds
                    }
                }, { transaction: t });
            }

            return affectedCount;
        });

        return res.json({
            success: true,
            message: `Successfully completed ${result} onboarding request(s)`,
            completedCount: result
        });

    } catch (error) {
        console.error('Bulk completion error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Failed to process bulk completion',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
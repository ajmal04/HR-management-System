import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import moment from "moment";
import ReactToolTip from "react-tooltip";
<<<<<<< HEAD
import ShowEventPopup from "./ShowEventPopup";
=======
import EventModal from "./EventModal";
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799

export default class Calendar extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      events: [],
<<<<<<< HEAD
      showAddModel: false,
      showModel: false,
      selectedEvent: {},
    };

    this.handleEventClick = this.handleEventClick.bind(this);
=======
      showModal: false,
      modalMode: 'add',
      selectedEvent: null
    };
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
  }

  componentDidMount() {
    this._isMounted = true;
<<<<<<< HEAD

    if (this._isMounted) {
      this.setState({ user: JSON.parse(localStorage.getItem("user")) }, () => {
        axios({
          method: "get",
          url: `api/personalEvents/user/${this.state.user.id}`,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => {
          let newEvents = res.data.map((x) => ({
            title: x.eventTitle,
            description: x.eventDescription,
            start: x.eventStartDate,
            end: x.eventEndDate,
            id: x.id,
            color: "#007bff",
            textColor: "white",
          }));

          for (var i in newEvents) {
            newEvents[i].start = moment(newEvents[i].start).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            newEvents[i].end = moment(newEvents[i].end).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }

          this.setState({ events: [...newEvents] });
        });
      });
    }
=======
    this.loadUserEvents();
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadUserEvents = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    axios({
      method: "get",
      url: `api/personalEvents/user/${user.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (!this._isMounted) return;

      const newEvents = res.data.map((x) => ({
        title: x.eventTitle,
        description: x.eventDescription,
        start: moment(x.eventStartDate).format("YYYY-MM-DD HH:mm:ss"),
        end: moment(x.eventEndDate).format("YYYY-MM-DD HH:mm:ss"),
        id: x.id,
        color: '#007bff',
        textColor: 'white'
      }));

      this.setState({ events: newEvents, user });
    })
    .catch(err => {
      console.error("Error loading events:", err);
    });
  }

  handleDateClick = () => {
    this.setState({
      showModal: true,
      modalMode: 'add',
      selectedEvent: null
    });
  }

  handleEventClick = (info) => {
    this.setState({
      showModal: true,
      modalMode: 'edit',
      selectedEvent: {
        id: info.event.id,
        title: info.event.title,
        description: info.event.extendedProps.description,
        start: info.event.start,
<<<<<<< HEAD
        end: info.event.end,
      },
      showModel: true,
    });
  }

  handleEventPositioned(info) {
    info.el.setAttribute(
      "title",
      info.event.extendedProps.description
        ? info.event.extendedProps.description
        : "No description"
    );
=======
        end: info.event.end
      }
    });
  }

  handleEventPositioned = (info) => {
    info.el.setAttribute("title", info.event.extendedProps.description || 'No description');
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
    ReactToolTip.rebuild();
  }

  render() {
<<<<<<< HEAD
    let closeAddModel = () => this.setState({ showAddModel: false });
    let closeShowModel = () => this.setState({ showModel: false });

=======
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
    return (
      <>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={this.state.events}
          dateClick={this.handleDateClick}
          eventClick={this.handleEventClick}
          eventPositioned={this.handleEventPositioned}
<<<<<<< HEAD
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
=======
          customButtons={{
            addEventButton: {
              text: "Add Event",
              click: () => this.setState({ 
                showModal: true,
                modalMode: 'add',
                selectedEvent: null 
              }),
              // Add these classes to match default styling
              classNames: 'fc-button fc-button-primary'
            }
          }}
          // Use BOTH header and headerToolbar for maximum compatibility
          header={{
            left: "prev,next today addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          headerToolbar={{
            left: "prev,next today addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
            meridiem: false,
            hour12: false,
          }}
<<<<<<< HEAD
          customButtons={{
            button: {
              text: "Add Event",
              click: () => {
                this.setState({ showAddModel: true });
              },
            },
          }}
          header={{
            left: "prev,next today button",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
        />
        <AddEventPopup show={this.state.showAddModel} onHide={closeAddModel} />
        {this.state.showModel ? (
          <ShowEventPopup
            show={true}
            onHide={closeShowModel}
            data={this.state.selectedEvent}
          />
        ) : (
          <></>
        )}
=======
        />

        <EventModal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          onSuccess={this.loadUserEvents}
          mode={this.state.modalMode}
          data={this.state.selectedEvent}
        />

        <ReactToolTip />
>>>>>>> e0349e3f2d10d722e3d8954792197004c6aee799
      </>
    );
  }
}
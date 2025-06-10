import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import moment from "moment";
import ReactToolTip from "react-tooltip";

export default class Calendar extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
      showAddModel: false,
      showModel: false,
      selectedEvent: {},
    };

    this.handleEventClick = this.handleEventClick.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      const user = JSON.parse(localStorage.getItem("user"));
      this.setState({ user: user }, () => {
        axios({
          method: "get",
          url: "http://localhost:5000/api/personalEvents/global",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => {
            console.log("Raw API Response:", res);
            console.log("res.data:", res.data);
            // if (!Array.isArray(res.data)) {
            //   console.error("Expected array but got:", res.data);
            //   alert(
            //     "Error loading calendar events. Check user access or token."
            //   );
            //   return;
            // }

            const newEvents = res.data.map((x) => ({
              title: x.eventTitle,
              description: x.eventDescription,
              start: moment(x.eventStartDate).format("YYYY-MM-DD HH:mm:ss"),
              end: moment(x.eventEndDate).format("YYYY-MM-DD HH:mm:ss"),
              id: x.id,
              color: "#28a745", // global event green
              textColor: "white",
            }));

            this.setState({ events: newEvents });
          })
          .catch((err) => {
            console.error(
              "Error loading events:",
              err
              // err.response?.data || err.message
            );
          });
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleEventClick(info) {
    this.setState({
      selectedEvent: {
        id: info.event.id,
        title: info.event.title,
        description: info.event.extendedProps.description,
        start: info.event.start,
        end: info.event.end,
      },
      showModel: true,
    });
  }

  handleEventPositioned(info) {
    info.el.setAttribute(
      "title",
      info.event.extendedProps.description || "No description"
    );
    ReactToolTip.rebuild();
  }

  render() {
    const closeAddModel = () => this.setState({ showAddModel: false });
    const closeShowModel = () => this.setState({ showModel: false });

    return (
      <>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          eventClick={this.handleEventClick}
          dateClick={() => this.setState({ showAddModel: true })}
          events={this.state.events}
          eventPositioned={this.handleEventPositioned}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          customButtons={{
            button: {
              text: "Add Event",
              click: () => this.setState({ showAddModel: true }),
            },
          }}
          header={{
            left: "prev,next today button",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
        />
      </>
    );
  }
}

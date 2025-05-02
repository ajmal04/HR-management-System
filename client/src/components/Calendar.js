import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import moment from "moment";
import ReactToolTip from "react-tooltip";
import EventModal from "./EventModal";

export default class Calendar extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      events: [],
      showModal: false,
      modalMode: 'add',
      selectedEvent: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadUserEvents();
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
        end: info.event.end
      }
    });
  }

  handleEventPositioned = (info) => {
    info.el.setAttribute("title", info.event.extendedProps.description || 'No description');
    ReactToolTip.rebuild();
  }

  render() {
    return (
      <>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={this.state.events}
          dateClick={this.handleDateClick}
          eventClick={this.handleEventClick}
          eventPositioned={this.handleEventPositioned}
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
            meridiem: false,
            hour12: false
          }}
        />

        <EventModal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          onSuccess={this.loadUserEvents}
          mode={this.state.modalMode}
          data={this.state.selectedEvent}
        />

        <ReactToolTip />
      </>
    );
  }
}
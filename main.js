//init new vue instance mounted on #main

new Vue({
  el: "#main",

  data: function(){

    return {

      // holds our tickets
      tickets: [],
      // initial sort order
      reverse: -1,
      // initial sort key
      sortKey: "draw",
      // initial ticket type filter
      type: "All",
      // initial search input filter
      search: "",

      /*
      ** initial prize amount comparison filter value - should actually be dynamically
      ** calculating this.
      */
      drawHigher: 500000,
    };
  },

  components: {
    'ticket-label': $$ticketComponent
  },

  // Apply sort conditionally based on user selected option
  filters: {

    sort: function(tickets){

      if(this.sortKey === "draw"){
        return this.sortByDraw(tickets);
      }

      if(this.sortKey === "time"){
        return this.sortByTime(tickets);
      }

    },

    /*
    ** Format currency in a human readable way, also decodes the human readable format
    ** so we can use it for number comparison filtering
    */
    currencyFormatter: {

      read: function(number){
          return "$" + d3.format(",2f")(parseFloat(number));
      },

      write: function(num){
        num = num.replace(/,/g, "");
        num = num.replace("$", "");
        if(isNaN(num) || num === ""){
          num = 0;
        }

        return num;
      }

    },

    /*
    ** Find tickets where the "Best Draw"(highest prize amount) is higher than the
    ** User's selected amount
    */

    drawAmountFilter: function(tickets){

      if(isNaN(this.drawHigher) || this.drawHigher === ""){
        return [];
      }

      var bestDrawAmount = 0;

      return tickets.filter(function(ticket){

        bestDrawAmount = this.getAmountFromDraw(this.bestDraw(ticket));
        return parseFloat(this.drawHigher) < bestDrawAmount;

      }.bind(this));

    },

    // Filter tickets by either "Lottery", "Raffle" or "All tickets"
    typeFilter: function(tickets){

      if(this.type === "All"){
        return tickets;
      }

      return tickets.filter(function(ticket){
        return ticket.type === this.type;
      }.bind(this));

    }

  },

  computed: {

    // Evaluate combination of user's filters to determine how many results were returned
    foundResults: function(){
      var result = this.$eval("tickets | typeFilter | drawAmountFilter | sort | filterBy search");

      return parseFloat(result.length);
    },

    // Create dynamic list based on ticket types
    ticket_types: function(){

      return Object.keys(d3.nest()
        .key(function(d){
          return d.type;
        })
        .map(this.tickets));

    }

  },

  methods: {

    // Sort tickets by their highest draw amount based on the sort order.
    sortByDraw: function(tickets){

      var bestDrawOfTicketA = 0;
      var bestDrawOfTicketB = 0;

      return tickets.slice().sort(function(ticketA,ticketB){
        bestDrawOfTicketA = this.getAmountFromDraw(this.bestDraw(ticketA));
        bestDrawOfTicketB = this.getAmountFromDraw(this.bestDraw(ticketB));

        return (this.reverse === -1 ? bestDrawOfTicketB - bestDrawOfTicketA : bestDrawOfTicketA - bestDrawOfTicketB);
      }.bind(this));

    },

    // Sort tickets by their closing date based on the sort order.
    sortByTime: function(tickets){

      return tickets.slice().sort(function(ticketA, ticketB){
        ticketA = this.findDrawEnd(ticketA).format("X");
        ticketB = this.findDrawEnd(ticketB).format("X");

        return (this.reverse === -1 ? ticketB - ticketA : ticketA - ticketB);

      }.bind(this));

    },

    // helper function to find the tickets closing date
    findDrawEnd: function(ticket){

      if(ticket.type === "lottery_ticket"){
        return moment(this.bestDraw(ticket).stop);
      }else{
        return moment(this.bestDraw(ticket).draw_stop);
      }

    },

    // either reverse the sort order or change the sorting key
    sort: function(sortKey){

      if(sortKey === this.sortKey){
        this.reverse = this.reverse * -1;
      }else{
        this.sortKey = sortKey;
      }

    },

    // helper function to find the highest prize amount dependant on ticket type
    getAmountFromDraw: function(draw){

      if(draw.hasOwnProperty('prize_pool')){
        return parseFloat(draw.prize_pool.amount);
      }else{
        return parseFloat(draw.prize.value.amount);
      }

    },

    // Reset all filters back to initial values
    clearFilters: function(){
        this.drawHigher = 0;
        this.search = "";
        this.type = "All";
    },

    // Find the highest draw prize of a ticket and return it
    bestDraw: function(ticket){

      if(!ticket.hasOwnProperty('draws')){
        return ticket.draw;
      }

      var draws = ticket.draws;

      return draws.slice().sort(function(a,b){
        return parseFloat(a.prize_pool.amount) - parseFloat(b.prize_pool.amount);
      })[0];

    }

  },

  // after init, get the tickets from JSON file
  ready: function(){
    this.$http.get("json/response.json").then(response =>{
      this.tickets = response.body.result;
    });
  },

})

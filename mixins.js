// Global mixin filters to be used across different components

// make keys more pretty
Vue.filter('text_modifier', function(text){
  if(text === "lottery_ticket"){
    return "Lottery Ticket";
  }
  if(text === "raffle_ticket"){
    return "Raffle Ticket";
  }
});

// turn a timestamp to dd/mm/yyyy
Vue.filter('timestamp', function(timestamp){
  return moment(timestamp).format("DD/MM/YYYY");
});

/*
** Find the relative time difference between today and a given date that
** could be in the past or the future.
*/
Vue.filter('relativeTime', function(date){
  var diff = moment().diff(moment(date,"DD/MM/YYYY"),"days");

  return (diff > 0 ? `${diff} Days ago..` : `${diff.toString().replace("-", "")} days left.`);

});

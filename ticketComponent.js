// Component which creates a label based on the ticket type
var $$ticketComponent = Vue.extend({
  props: ['ticket_type'],

  template: `
      <span v-if="ticket_type === 'raffle_ticket'" class="badge badge-primary">
        {{ticket_type | text_modifier}}
      </span>

      <span v-if="ticket_type === 'lottery_ticket'" class="badge badge-success">
        {{ticket_type | text_modifier}}
      </span>
  `
})

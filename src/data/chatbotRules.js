export const CHATBOT_RULES = {
  start: {
    message: "Hi there! 👋 I'm the ParaStructure assistant. What can I help you with today?",
    options: [
      { label: "Tell me about the programs", next: "programs" },
      { label: "What are the fees?", next: "fees" },
      { label: "Can I speak to a human?", next: "human" }
    ]
  },
  programs: {
    message: "We offer highly specialized live cohorts: RCC Bridge Design, Steel Bridge Design, and PSC Bridge Design. All programs focus on real project data and industry-standard tools like MIDAS Civil.",
    options: [
      { label: "Which one is right for me?", next: "which_program" },
      { label: "Go back", next: "start" }
    ]
  },
  which_program: {
    message: "I recommend checking the curriculum on our programs page! We tailor our training to the most demanded skills in infrastructure engineering.",
    options: [
      { label: "Go back", next: "start" }
    ]
  },
  fees: {
    message: "Our cohorts are priced at standard Indian rates. We offer flexible EMI options so you can pay in installments over the course of the 8-month program.",
    options: [
      { label: "Do you offer placement?", next: "placement" },
      { label: "Go back", next: "start" }
    ]
  },
  placement: {
    message: "We focus 100% on engineering mastery. You will build a professional portfolio using real load cases and MIDAS models that you can take directly to interviews. We don't make fake job guarantees.",
    options: [
      { label: "Go back", next: "start" }
    ]
  },
  human: {
    message: "Absolutely! You can reach our team directly by filling out the form on our Contact page, and a senior engineer will call you back within 24 hours.",
    options: [
      { label: "Go back", next: "start" }
    ]
  }
};

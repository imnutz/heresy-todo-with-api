import API from "./api";

export default {
  acceptors: [
    (model) => (proposal) => {
      if (proposal.apiItems) {
        model.items = proposal.apiItems;
      }

      return model;
    }
  ]
}

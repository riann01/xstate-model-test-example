const xstate = require("xstate");

const { createMachine, send } = xstate;

const machine = createMachine({
  id: "newMachine",
  type: "parallel",
  states: {
    carSemaphore: {
      initial: "green",
      states: {
        yellow: {
          entry: [
            send({
              type: "changePedestrian",
              data: { targetPedestrianState: "green" },
            }),
          ],
          after: {
            1000: "red",
          },
        },
        red: {
          entry: [
            send({
              type: "changePedestrian",
              data: { targetPedestrianState: "green" },
            }),
          ],
          after: {
            1000: "green",
          },
        },
        green: {
          entry: [
            send({
              type: "changePedestrian",
              data: { targetPedestrianState: "red" },
            }),
          ],
          after: {
            1000: "yellow",
          },
        },
      },
    },
    pedestrianSemaphore: {
      initial: "green",
      states: {
        red: {},
        green: {},
      },
      on: {
        changePedestrian: [
          {
            target: ".red",
            cond: (_, evt) => evt.data.targetPedestrianState === "red",
          },
          {
            target: ".green",
            cond: (_, evt) => evt.data.targetPedestrianState === "green",
          },
        ],
      },
    },
  },
});

module.exports = { machine };

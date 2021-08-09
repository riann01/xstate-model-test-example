const { createMachine, interpret, send } = require("xstate");
const { createModel } = require("@xstate/test");

const { machine: sut } = require("./semaphoreMachine");

const modelMachine = createMachine({
  id: "parent",
  initial: "idle",
  states: {
    idle: {
      meta: {
        test: (params) => {
          const { service } = params;
          const childService = service;
          const { carSemaphore, pedestrianSemaphore } =
            childService.state.value;
          expect(carSemaphore).toBe("green");
          expect(pedestrianSemaphore).toBe("red");
        },
      },
      on: {
        changeToYellow: "changeToYellow",
      },
    },
    changeToRed: {
      meta: {
        test: (params) => {
          const { service } = params;
          const childService = service;
          const { carSemaphore, pedestrianSemaphore } =
            childService.state.value;
          expect(carSemaphore).toBe("red");
          expect(pedestrianSemaphore).toBe("green");
        },
      },
      on: {
        changeToGreen: "changeToGreen",
      },
    },
    changeToGreen: {
      meta: {
        test: (params) => {
          const { service } = params;
          const childService = service;
          const { carSemaphore, pedestrianSemaphore } =
            childService.state.value;
          expect(carSemaphore).toBe("green");
          expect(pedestrianSemaphore).toBe("red");
        },
      },
      on: {
        changeToYellow: "changeToYellow",
      },
    },
    changeToYellow: {
      meta: {
        test: (params) => {
          const { service } = params;
          const childService = service;
          const { carSemaphore, pedestrianSemaphore } =
            childService.state.value;
          expect(carSemaphore).toBe("yellow");
          expect(pedestrianSemaphore).toBe("green");
        },
      },
      on: {
        changeToRed: "changeToRed",
      },
    },
  },
});

const semaphoreModel = createModel(modelMachine).withEvents({
  changeToRed: {
    exec: async () => {
      return new Promise((resolve) => {
        return setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
  },
  changeToGreen: {
    exec: async () => {
      return new Promise((resolve) => {
        return setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
  },
  changeToYellow: {
    exec: async () => {
      return new Promise((resolve) => {
        return setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
  },
});

let sutSvc;

describe("semaphore", () => {
  const testPlans = semaphoreModel.getSimplePathPlans();
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          // do any setup, then...
          sutSvc = interpret(sut).start();
          await path.test({
            service: sutSvc,
          });
        });
      });
    });
  });

  it("should have full coverage", () => {
    return semaphoreModel.testCoverage();
  });

  afterEach(() => {
    sutSvc.stop();
  });
});

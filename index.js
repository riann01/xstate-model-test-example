const { interpret } = require("xstate");
const { machine } = require("./semaphoreMachine");

const service = interpret(machine);

service.onTransition((state) => {
  console.clear();
  console.log(
    `SEMÁFORO DE CARROS: ${state.value.carSemaphore}, SEMÁFORO DE PEDESTRE: ${state.value.pedestrianSemaphore}`
  );
});

service.start();

setInterval(() => {
  service.send("change");
}, 1500);

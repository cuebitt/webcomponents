import { signal } from "@preact/signals";
import register from "preact-custom-element";

const App = () => {
  const count = signal(0);

  return (
    <>
      <button onClick={() => (count.value += 1)}>count is {count}</button>
    </>
  );
};

register(App, "preact-app", [], { shadow: true });

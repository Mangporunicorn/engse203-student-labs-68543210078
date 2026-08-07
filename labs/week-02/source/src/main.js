import "./style.css";

import { fetchLearningTasks } from "./api.js";
import { filterTasks, getStats } from "./utils.js";
import {
  renderStats,
  renderTasks,
  setMessage,
} from "./ui.js";

const elements = {
  message: document.querySelector("#app-message"),
  stats: document.querySelector("#stats"),
  taskList: document.querySelector("#task-list"),
  search: document.querySelector("#search"),
  statusFilter: document.querySelector("#status-filter"),
};

const state = {
  tasks: [],
  query: "",
  status: "all",
};

function renderDashboard() {
  const filteredTasks = filterTasks(state.tasks, {
    query: state.query,
    status: state.status,
  });

  const stats = getStats(state.tasks);

  renderStats(elements.stats, stats);
  renderTasks(elements.taskList, filteredTasks);
}

async function loadDashboard() {
  const searchParams = new URLSearchParams(window.location.search);
  const simulateError = searchParams.get("simulateError") === "1";

  try {
    setMessage(
      elements.message,
      "loading",
      "Loading learning tasks...",
    );

    elements.search.disabled = true;
    elements.statusFilter.disabled = true;

    state.tasks = await fetchLearningTasks({
      simulateError,
    });

    renderDashboard();

    setMessage(
      elements.message,
      "success",
      `Successfully loaded ${state.tasks.length} learning tasks.`,
    );
  } catch (error) {
    state.tasks = [];

    renderStats(elements.stats, getStats([]));
    renderTasks(elements.taskList, []);

    setMessage(
      elements.message,
      "error",
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.",
    );
  } finally {
    elements.search.disabled = false;
    elements.statusFilter.disabled = false;
  }
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderDashboard();
});

elements.statusFilter.addEventListener("change", (event) => {
  state.status = event.target.value;
  renderDashboard();
});

loadDashboard();
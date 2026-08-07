import { getStatusLabel } from "./utils.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function setMessage(element, type, text) {
  element.className = `message ${type}`;
  element.textContent = text;
}

export function renderStats(element, stats) {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
    },
    {
      label: "To do",
      value: stats.todo,
    },
    {
      label: "In progress",
      value: stats.doing,
    },
    {
      label: "Done",
      value: stats.done,
    },
  ];

  element.innerHTML = statItems
    .map(
      ({ label, value }) => `
        <article class="stat-card">
          <p>${escapeHtml(label)}</p>
          <strong>${value}</strong>
        </article>
      `,
    )
    .join("");
}

export function renderTasks(element, tasks) {
  if (tasks.length === 0) {
    element.innerHTML = `
      <div class="empty-state">
        <h2>No tasks found</h2>
        <p>Try changing the search text or selected status.</p>
      </div>
    `;

    return;
  }

  element.innerHTML = tasks
    .map(
      ({ week, title, topic, status, tags = [] }) => `
        <article class="task-card">
          <div class="task-meta">
            <span class="badge">Week ${week}</span>
            <span class="badge">${escapeHtml(getStatusLabel(status))}</span>
          </div>

          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(topic)}</p>

          <div class="tags">
            ${tags
              .map(
                (tag) => `
                  <span class="tag">${escapeHtml(tag)}</span>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
}
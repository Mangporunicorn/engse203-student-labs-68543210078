export function getStatusLabel(status) {
  const statusLabels = {
    todo: "To do",
    doing: "In progress",
    done: "Done",
  };

  return statusLabels[status] ?? "Unknown";
}

export function filterTasks(tasks, { query = "", status = "all" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  return tasks.filter((task) => {
    const searchableText = [
      task.title,
      task.topic,
      ...(task.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      normalizedQuery === "" || searchableText.includes(normalizedQuery);

    const matchesStatus =
      status === "all" || task.status === status;

    return matchesQuery && matchesStatus;
  });
}

export function getStats(tasks) {
  return tasks.reduce(
    (stats, task) => {
      stats.total += 1;

      if (task.status === "todo") {
        stats.todo += 1;
      }

      if (task.status === "doing") {
        stats.doing += 1;
      }

      if (task.status === "done") {
        stats.done += 1;
      }

      return stats;
    },
    {
      total: 0,
      todo: 0,
      doing: 0,
      done: 0,
    },
  );
}
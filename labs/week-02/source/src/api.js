// TODO: export async function fetchLearningTasks({ simulateError = false } = {}) {
// 1) เมื่อ simulateError เป็น true ให้ throw Error
// 2) ใช้ import.meta.env.BASE_URL เพื่อสร้าง URL ของ JSON
// 3) ใช้ await fetch(...)
// 4) ตรวจ response.ok
// 5) return await response.json()
// }
export async function fetchLearningTasks({ simulateError = false } = {}) {
  if (simulateError) {
    throw new Error("Simulated error: data source is unavailable");
  }

  //const url = new URL("data/learning-tasks.json", import.meta.env.BASE_URL);
  const url = `${import.meta.env.BASE_URL}data/learning-tasks.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load tasks (HTTP ${response.status})`);
  }

  const tasks = await response.json();

  if (!Array.isArray(tasks)) {
    throw new Error("The data source returned an invalid task collection");
  }

  return tasks;
}


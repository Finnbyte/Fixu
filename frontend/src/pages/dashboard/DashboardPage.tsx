import { Course } from "../../../../backend/db/schemas/courses";
import styles from "./DashboardPage.module.scss";

function getRecentlyViewedCourses(): Course[] | null {
  const result = localStorage.getItem("recentlyViewedCourses");
  if (!result) return null;
  try {
    const courses = JSON.parse(result) as Course[];
    return courses.slice(0, 2);
  } catch {
    return null
  }
}

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <h1>My recently viewed courses</h1>
    </div>
  )
}

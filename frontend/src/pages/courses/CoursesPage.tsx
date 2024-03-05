import styles from "./CoursesPage.module.scss";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useRef } from "react";
import { useGetCoursesQuery, useGetEnrolledCoursesQuery } from "../../slices/api";
import { format } from "date-fns";
import "../../_common.scss";

interface CourseProps {
  name: string;
  description: string;
  createdAt: Date;
  endedAt: Date | null;
}

function CourseCard({ name, description, createdAt, endedAt }: CourseProps) {
  function formatDate(date: Date) {
    return format(date, "dd MMMM yyyy");
  }
  return (
    <div className={styles.course}>
      <img />
      <div className={styles["information-container"]}>
        <h2>{name}</h2>
        <br/>
        {description || "No description"}
        <br/><br/>
        <span style={{ opacity: "0.55", fontWeight: "bold" }}>{formatDate(createdAt)} - {`${endedAt && formatDate(endedAt)}`}</span>
      </div>
      <div style={{ display: "inline-block", marginLeft: "auto" }}>
        <button onClick={() => onView()} className={"material-btn"}>View</button>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const user = useAppSelector((state) => state.user.data!);
  const { data: courses } = useGetCoursesQuery();
  const { data: enrolledCourses } = useGetEnrolledCoursesQuery(user.id);

  const dialogRef = useRef<HTMLDialogElement>(null);

  if (!courses || !enrolledCourses) {
    return null;
  }

  return (
    <div className={styles.page}>
      <dialog ref={dialogRef}>
        <p>Moroo:)</p>
      </dialog>
      {user?.privilege === "admin" && (
        <button onClick={() => dialogRef.current?.showModal()}>
          Create a course
        </button>
      )}
      <div className={styles["courses-container"]}>
        {courses.map((course) => {
          return (
            <CourseCard
              key={course.id}
              {...course}
            />
          );
        })}
      </div>
    </div>
  );
}

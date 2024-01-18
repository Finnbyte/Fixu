import { useFetch } from "../../hooks/useFetch";
import styles from "./CoursesPage.module.scss";
import { Course } from "../../../../backend/db/schemas/courses";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useRef } from "react";

interface CourseProps {
  title: string;
  description: string;
  isEnrolled: boolean;
  onMembershipUpdate: (type: "join" | "leave") => void;
}

function Course({ title, description, isEnrolled, onMembershipUpdate }: CourseProps) {
  return (
    <div className={styles.course}>
      <img />
      <div className={styles["information-container"]}>
        {title}
        <br/>
        {description}
      </div>
      <button onClick={() => onMembershipUpdate(isEnrolled ? "join" : "leave")}>
        {isEnrolled ? "Join course" : "Leave course"}
      </button>
    </div>
  )
}

export default function CoursesPage() {
  const user = useAppSelector(state => state.user.data);
  const result = useFetch<Course[]>("/api/courses");
  const dialogRef = useRef<HTMLDialogElement>(null);
  if (!result.data) {
    return null;
  }

  const courses = result.data;

  function handleMembershipUpdate(courseId: string, type: "join" | "leave") {
    //todo
    console.log(courseId, type);
  }


  return (
    <div className={styles.page}>
      <dialog ref={dialogRef}>
        <p>Moroo:)</p>
      </dialog>
      {user?.privilege === "admin" && (
        <button onClick={() => dialogRef.current?.showModal()}>Create a course</button>
      )}
      {courses.map((course) => {
        const { id, name, description } = course;
        return (
          <Course
            key={id}
            title={name}
            description={description}
            isEnrolled={true}
            onMembershipUpdate={(type) => handleMembershipUpdate(id, type)}
          />
        );
      })}
    </div>
  );
}

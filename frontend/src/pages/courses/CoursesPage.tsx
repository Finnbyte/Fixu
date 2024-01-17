import { useFetch } from "../../hooks/useFetch";
import styles from "./CoursesPage.module.scss";
import { Course } from "../../../../backend/db/schemas/courses";

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
        {isEnrolled ? "Join" : "Leave"}
      </button>
    </div>
  )
}

export default function CoursesPage() {
  const result = useFetch<Course[]>("/api/courses");
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

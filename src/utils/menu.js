import { list, check, todo, home, cross, minor } from "./Icons";

const menu = [
  {
    id: 1,
    title: "All Tasks",
    icon: home,
    link: "/",
  },
  {
    id: 2,
    title: "Important",
    icon: list,
    link: "/important",
  },
  {
    id: 3,
    title: "Minor",
    icon: minor,
    link: "/minor",
  },
  {
    id: 4,
    title: "Completed",
    icon: check,
    link: "/completed",
  },
  {
    id: 5,
    title: "Not Completed",
    icon: cross,
    link: "/incomplete",
  },
  {
    id: 6,
    title: "Urgent",
    icon: todo,
    link: "/high-priority",
  },
];

export default menu;
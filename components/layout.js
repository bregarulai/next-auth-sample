import { MyHeader } from "../components";

export default function Layout({ children }) {
  return (
    <>
      <MyHeader />
      <main>{children}</main>
    </>
  );
}

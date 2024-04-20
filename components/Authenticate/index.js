import { useState } from "react";
import { LoginForm } from "../Forms/LoginForm";
import { SignupForm } from "../Forms/SignupForm";

export const Authenticate = (setUser) => {
  const [page, setPage] = useState(0);

  const handleChangePage = (val) => {
    setPage(val);
  };

  return (
    <>
      {page === 0 ? (
        <LoginForm action={handleChangePage} setUser={setUser} />
      ) : page === 1 ? (
        <SignupForm action={handleChangePage} setUser={setUser} />
      ) : null}
    </>
  );
};

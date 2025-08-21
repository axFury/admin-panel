// app/login/page.tsx
import LoginClient from "./login-client";

export default function LoginPage({
                                    searchParams,
                                  }: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const nextParam = typeof searchParams.next === "string" ? searchParams.next : undefined;
  return <LoginClient nextParam={nextParam} />;
}

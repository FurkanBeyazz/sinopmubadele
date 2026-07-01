import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/admin/login",
    },
});

// Protect /admin itself AND all /admin/* routes EXCEPT /admin/login
export const config = {
    matcher: ["/admin", "/admin/((?!login).*)"],
};

import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/admin/login",
    },
});

// Protect all /admin routes EXCEPT /admin/login and /api/auth
export const config = {
    matcher: ["/admin/((?!login).*)"],
};

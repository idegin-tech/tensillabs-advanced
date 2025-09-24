Make sure to follow the coding style and file naming convention of the project.
Make sure the files you update don't have error or syntax errors.
Make sure your implementation is as detailed as possible and production ready.
Make sure to check other files to see how it was implemented other places.
Make sure to follow industry Best practices.
When work on the UI, make sure to use only shadcn and shadcn colors.
Files should follow the naming convention of the <name>.<purpose>.<extension>. Ex. use-auth.api.tsx auth.context.tsx auth.controller.ts auth.types.ts auth.utils.ts
Use the prisma schema as types where possible.
Don't add code comments.
Don't add code comments.
Don't add code comments.


# What is TensilLabs
TensilLabs is an open-source platform designed to facilitate collaborative workspaces for teams and individuals. It offers a range of features including project management, task tracking, and real-time collaboration tools. The platform is built with a focus on user experience, security, and scalability, making it suitable for both small teams and large organizations. When it's not self-hosted, we give them a unique subdomain for their workspace (workspace slug).
Users can choose to self-host the application on their own servers for a license fee or use the hosted version provided by TensilLabs.

# Authentication
If it's self-hosted, the first user to sign up becomes the admin of the workspace. If it's not self-hosted, users can sign up using email and password then create a workspace. A user can't have multiple workspaces.

# Concept
- SELF_HOSTED (boolean): This is when the app is self-hosted by the user on their own vps or server. If it's true, it means the app is running in self-hosted mode.
- Workspace subdomain: The workspace slug serves as the subdomain for the workspace. We only use the subdomain if SELF_HOSTED is false.
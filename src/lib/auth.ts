import { currentUser } from "@clerk/nextjs/server";

/**
 * Verifies that the request is made by an authenticated Clerk user.
 * Throws an error if unauthenticated.
 */
export async function requireAuthorizedUser() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress || user.emailAddresses[0]?.emailAddress;

  return {
    user,
    email: primaryEmail,
  };
}

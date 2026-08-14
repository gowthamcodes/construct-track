export function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/invalid-credential':
      return 'Invalid email or password.';

    case 'auth/user-not-found':
      return 'No account was found with this email.';

    case 'auth/wrong-password':
      return 'Invalid email or password.';

    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';

    case 'auth/weak-password':
      return 'Please use a stronger password.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';

    case 'auth/network-request-failed':
      return 'Please check your internet connection.';

    default:
      return 'Something went wrong. Please try again.';
  }
}

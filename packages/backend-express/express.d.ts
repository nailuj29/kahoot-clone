declare namespace Express {
  interface Request {
    /**
     * Whether or not the user was authenticated.
     */
    authenticated: boolean = false;
    /**
     * The id of the user. Set iff the requireAuth middleware succeeds
     */
    id?: string;
  }
}

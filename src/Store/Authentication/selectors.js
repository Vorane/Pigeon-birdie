export const getAuth = ({ auth }) => ({
  auth: auth.auth,
  loginProcess: auth._loginProcess
});

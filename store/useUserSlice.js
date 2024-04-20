const userInitialState = {
  id: "",
  firstName: "",
  lastName: "",
  auth: {
    id: "",
    email: "",
    createdAt: "",
    updatedAt: "",
    confirmed: false,
  },
};

export const useUserSlice = (set, get) => ({
  user: {
    ...userInitialState,
  },

  setUser: (user) => set((state) => ({ ...state, user: { ...user } })),
  clearUser: () =>
    set((state) => ({ ...state, user: { ...userInitialState } })),

  updateFirstName: (firstName) =>
    set((state) => ({ user: { ...state.user, firstName } })),
  updateLastName: (lastName) =>
    set((state) => ({ user: { ...state.user, lastName } })),
  updateEmail: (email) =>
    set((state) => ({
      user: {
        ...state.user,
        auth: {
          ...state.user.auth,
          email: email,
        },
      },
    })),
});

import * as Yup from "yup";

export const NewPasswordValidation = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, "checks"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

export const loginValidation = Yup.object().shape({
  email: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required("Email is required"),
  password: Yup.string()
    .required()
    .min(6)
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
  // 
  // ),
});
export const forgetPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required("Email is required"),
  new_password: Yup.string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
    ),
});

export const signUpValidation = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  phone: Yup.string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Number must be exactly 10 digits"),

  email: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required("Email is required"),

  password: Yup.string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
    ),
});

export const addLibraryValidation = Yup.object({
  name: Yup.string()
    .required("Library name is required")
    .min(3, "Library name must be at least 3 characters")
    .max(100, "Library name must not exceed 100 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  state: Yup.string()
    .required("State is required")
    .min(2, "State must be at least 2 characters"),
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),
  locality: Yup.string()
    .required("Locality is required")
    .min(2, "Locality must be at least 2 characters"),
  totalSeats: Yup.number()
    .required("Total seats is required")
    .positive("Seats must be a positive number")
    .integer("Seats must be a whole number")
    .min(1, "Minimum 1 seat required")
    .max(10000, "Maximum 10000 seats allowed"),

  shifts: Yup.object({
    morning: Yup.object({
      start: Yup.string().required("Morning start time is required"),
      end: Yup.string().required("Morning end time is required"),
    }),
    evening: Yup.object({
      start: Yup.string().required("Evening start time is required"),
      end: Yup.string().required("Evening end time is required"),
    }),
    fullDay: Yup.object({
      start: Yup.string().required("Full day start time is required"),
      end: Yup.string().required("Full day end time is required"),
    }),
  }),
  pricing: Yup.object({
    half_day: Yup.object({
      monthly: Yup.number()
        .typeError("Half-day monthly price must be a number")
        .required("Half-day monthly price is required")
        .moreThan(0, "Price must be greater than 0"),
      quarterly: Yup.number()
        .typeError("Half-day quarterly price must be a number")
        .required("Half-day quarterly price is required")
        .moreThan(0, "Price must be greater than 0"),
      yearly: Yup.number()
        .typeError("Half-day yearly price must be a number")
        .required("Half-day yearly price is required")
        .moreThan(0, "Price must be greater than 0"),
    }),
    full_day: Yup.object({
      monthly: Yup.number()
        .typeError("Full-day monthly price must be a number")
        .required("Full-day monthly price is required")
        .moreThan(0, "Price must be greater than 0"),
      quarterly: Yup.number()
        .typeError("Full-day quarterly price must be a number")
        .required("Full-day quarterly price is required")
        .moreThan(0, "Price must be greater than 0"),
      yearly: Yup.number()
        .typeError("Full-day yearly price must be a number")
        .required("Full-day yearly price is required")
        .moreThan(0, "Price must be greater than 0"),
    }),
  }),
});

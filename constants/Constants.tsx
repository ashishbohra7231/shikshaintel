// import { constants } from "buffer";

export class Constants {

  static API_URL = process.env.NEXT_PUBLIC_API_URL || "https://library-backend-1-eazh.onrender.com/api";

  static SIGN_UP = `${Constants.API_URL}/auth/register`;
  static SEND_OTP = `${Constants.API_URL}/auth/send-otp`;
  static login_url = `${Constants.API_URL}/auth/login/`;
  static add_library_url = `${Constants.API_URL}/libraries`;
  static get_libraries_url = `${Constants.API_URL}/libraries/`;
  static get_libraries_by_slug_url = `${Constants.API_URL}/libraries/slug/`;
  static add_student_url = `${Constants.API_URL}/students`;
  static send_reminder_url = `${Constants.API_URL}/students/`;
  static notifications_url = `${Constants.API_URL}/notifications`;
  static monthly_stats_url = `${Constants.API_URL}/students/monthly-stats`;
  static get_billing_history_url = `${Constants.API_URL}/libraries/billing/history`;
  static generate_bills_url = `${Constants.API_URL}/libraries/billing/generate`;
  // :slug 
}

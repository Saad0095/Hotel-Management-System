import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export const sendBookingConfirmation = async (to, booking, user, roomData, services = []) => {
  const roomsList = roomData.map(r => `<li>${r.roomType} (Room #${r.roomNumber})</li>`).join("");
  const servicesList = services.length > 0
    ? services.map(s => `<li>${s.name} - $${s.price}</li>`).join("")
    : "<li>No extra services</li>";

  const mailOptions = {
    from: `"Hotel Management" <${process.env.SMTP_USER}>`,
    to,
    subject: "Booking Confirmation",
    html: `
      <h2>Dear ${user.name},</h2>
      <p>Thank you for your booking! Here are your booking details:</p>
      <ul>
        <li><b>Check-In:</b> ${new Date(booking.checkInDate).toDateString()}</li>
        <li><b>Check-Out:</b> ${new Date(booking.checkOutDate).toDateString()}</li>
        <li><b>Total Price:</b> $${booking.totalPrice}</li>
      </ul>
      <h3>Rooms:</h3>
      <ul>${roomsList}</ul>
      <h3>Extra Services:</h3>
      <ul>${servicesList}</ul>
      <p>We look forward to hosting you!</p>
      <p><b>Hotel Management Team</b></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendCheckInEmail = async (to, booking, user) => {
  const mailOptions = {
    from: `"Hotel Management" <${process.env.SMTP_USER}>`,
    to,
    subject: "Check-In Successful",
    html: `
      <h2>Dear ${user.name},</h2>
      <p>We’re happy to welcome you! Your check-in was successful.</p>
      <ul>
        <li><b>Check-In Date:</b> ${new Date(booking.checkInDate).toDateString()}</li>
        <li><b>Check-Out Date:</b> ${new Date(booking.checkOutDate).toDateString()}</li>
        <li><b>Status:</b> ${booking.status}</li>
      </ul>
      <p>Enjoy your stay!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendCheckOutEmail = async (to, booking, user) => {
  const mailOptions = {
    from: `"Hotel Management" <${process.env.SMTP_USER}>`,
    to,
    subject: "Check-Out Successful",
    html: `
      <h2>Dear ${user.name},</h2>
      <p>We hope you enjoyed your stay! Your check-out was successful.</p>
      <ul>
        <li><b>Check-In:</b> ${new Date(booking.checkInDate).toDateString()}</li>
        <li><b>Check-Out:</b> ${new Date(booking.checkOutDate).toDateString()}</li>
        <li><b>Total Paid:</b> $${booking.totalPrice}</li>
      </ul>
      <p>We hope to see you again soon!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendCancelBookingEmail = async (to, booking, user) => {
  const mailOptions = {
    from: `"Hotel Management" <${process.env.SMTP_USER}>`,
    to,
    subject: "Booking Cancelled",
    html: `
      <h2>Dear ${user.name},</h2>
      <p>Your booking has been <b>cancelled</b>.</p>
      <ul>
        <li><b>Check-In:</b> ${new Date(booking.checkInDate).toDateString()}</li>
        <li><b>Check-Out:</b> ${new Date(booking.checkOutDate).toDateString()}</li>
        <li><b>Status:</b> ${booking.status}</li>
      </ul>
      <p>If this was a mistake or you want to rebook, please contact us anytime.</p>
      <p>We hope to see you again soon!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

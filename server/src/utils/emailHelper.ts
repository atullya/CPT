export const adminInviteTemplate = (
  name: string,
  resetLink: string,
  tempPassword: string,
  expiry: string,
) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding:40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:40px; font-family:Arial, sans-serif; color:#333;">
        
        <!-- Header -->
        <tr>
          <td style="text-align:center; padding-bottom:20px;">
            <h2 style="margin:0; font-size:24px; color:#111;">Admin Access Invitation</h2>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="font-size:16px; line-height:24px;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>You have been granted temporary access to your account by the Super Admin.</p>
            <p>Please use the button below to log in and set your new password.</p>
          </td>
        </tr>

        <!-- Button -->
        <tr>
          <td align="center" style="padding:25px 0;">
            <a href="${resetLink}" 
               style="background:#4F46E5; color:#fff; padding:12px 22px; border-radius:6px; text-decoration:none; font-size:16px;">
              Log In & Set New Password
            </a>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="font-size:16px; line-height:24px;">
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p><strong>Password Expiry:</strong> ${expiry}</p>
            <p style="margin-top:20px;">Please change your password immediately after logging in.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:30px; font-size:14px; color:#888; text-align:center;">
            <p>Thanks,<br/>The Team</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;
export const passwordResetTemplate = (resetUrl: string, expiry: string = '1 hour') => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding:40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:40px; font-family:Arial, sans-serif; color:#333;">

        <tr>
          <td style="text-align:center; padding-bottom:20px;">
            <h2 style="margin:0; font-size:24px; color:#111;">Password Reset</h2>
          </td>
        </tr>

        <tr>
          <td style="font-size:16px; line-height:24px;">
            <p>We received a request to reset your password.</p>
            <p>Click the button below to continue:</p>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:25px 0;">
            <a href="${resetUrl}" 
               style="background:#2563EB; color:#fff; padding:12px 22px; border-radius:6px; text-decoration:none; font-size:16px;">
              Reset Password
            </a>
          </td>
        </tr>

        <tr>
          <td style="font-size:16px; line-height:24px;">
            <p>This link will expire in <strong>${expiry}</strong>.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
          </td>
        </tr>

        <tr>
          <td style="padding-top:30px; font-size:14px; color:#888; text-align:center;">
            <p>Thanks,<br/>The Team</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;

export const userInviteTemplate = (
  name: string,
  resetLink: string,
  tempPassword: string,
  expiry: string,
) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding:40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:40px; font-family:Arial, sans-serif; color:#333;">
        
        <tr>
          <td style="text-align:center; padding-bottom:20px;">
            <h2 style="margin:0; font-size:24px; color:#111;">Welcome to Our Platform</h2>
          </td>
        </tr>

        <tr>
          <td style="font-size:16px; line-height:24px;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>You have been granted temporary access to your account.</p>
            <p>Please use the button below to log in and set your new password.</p>
          </td>
        </tr>

        <!-- Button -->
        <tr>
          <td align="center" style="padding:25px 0;">
            <a href="${resetLink}" 
               style="background:#4F46E5; color:#fff; padding:12px 22px; border-radius:6px; text-decoration:none; font-size:16px;">
              Log In & Set New Password
            </a>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="font-size:16px; line-height:24px;">
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p><strong>Password Expiry:</strong> ${expiry}</p>
            <p style="margin-top:20px;">Please change your password immediately after logging in.</p>
          </td>
        </tr>

        <tr>
          <td style="padding-top:30px; font-size:14px; color:#888; text-align:center;">
            <p>Thanks,<br/>The Team</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;

export const superAdminInviteTemplate = (
  name: string,
  resetLink: string,
  tempPassword: string,
  expiry: string,
) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding:40px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:40px; font-family:Arial, sans-serif; color:#333;">
        
        <!-- Header -->
        <tr>
          <td style="text-align:center; padding-bottom:20px;">
            <h2 style="margin:0; font-size:24px; color:#111;">Super Admin Access Invitation</h2>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="font-size:16px; line-height:24px;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>You have been granted Super Admin access to the platform by another Super Admin.</p>
            <p>Please use the button below to log in and set your new password.</p>
          </td>
        </tr>

        <!-- Button -->
        <tr>
          <td align="center" style="padding:25px 0;">
            <a href="${resetLink}" 
               style="background:#D946EF; color:#fff; padding:12px 22px; border-radius:6px; text-decoration:none; font-size:16px;">
              Log In & Set New Password
            </a>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="font-size:16px; line-height:24px;">
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p><strong>Password Expiry:</strong> ${expiry}</p>
            <p style="margin-top:20px;">Please change your password immediately after logging in.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:30px; font-size:14px; color:#888; text-align:center;">
            <p>Thanks,<br/>The Team</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;

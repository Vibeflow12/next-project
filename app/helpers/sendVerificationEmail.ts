import { resend } from '@/app/lib/resend'
import VerificationEmail from '../emails/verificationEmail'
import { ApiResponse } from '@/app/types/ApiResponse'

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        })

        return {
            success: true,
            message: 'send verification email successfully',
            status: 200
        }

    } catch (emailError) {
        console.error("Error sending sending verification email", emailError)
        return {
            success: false,
            message: 'Failed to send verification email',
            status: 500
        }
    }
}
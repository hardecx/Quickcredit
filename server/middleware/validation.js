import help from '../helpers/help';
import statusCodes from '../helpers/statuscodes';

/**
 * @class UserValidate
 */
class UserValidate {
  // eslint-disable-next-line consistent-return
  static validateSignup(request, response, next) {
    const {
      firstName, lastName, email, homeAddress, workAddress, phoneNumber, password, confirmPassword,
    } = request.body;

    if (!firstName || firstName.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'First name is required',
      });
    }

    if (!lastName || lastName.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'Last name is required',
      });
    }

    if (!email || email.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'Email is required',
      });
    }
    if (!homeAddress || homeAddress.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'Home Address is required',
      });
    }
    if (!workAddress || workAddress.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'Work Address is required',
      });
    }
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'Phone Number is required',
      });
    }
    if (email) {
      const isValid = help.emailValidator(email);
      if (!isValid) {
        return response.status(400).json({
          status: statusCodes.badRequest,
          error: 'Invalid email address',
        });
      }

      if (!password || password.trim().length === 0) {
        return response.status(400).json({
          status: statusCodes.badRequest,
          error: 'Password is required',
        });
      }

      if (password !== confirmPassword) {
        return response.status(400).json({
          status: statusCodes.badRequest,
          error: 'Passwords do not match',
        });
      }
      next();
    }
  }

  // eslint-disable-next-line consistent-return
  static validateSignin(request, response, next) {
    const { email, password, } = request.body;
    if (!email || email.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'Email is required',
      });
    }

    if (email) {
      const isValid = help.emailValidator(email);
      if (!isValid) {
        return response.status(400).json({
          status: statusCodes.badRequest,
          error: 'Invalid login details, email or password is wrong',
        });
      }
    }

    if (!password || password.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'Password is required',
      });
    }
    next();
  }

  // eslint-disable-next-line consistent-return
  static validateStatusChange(request, response, next) {
    const { status } = request.body;
    if (!status || status.trim().length === 0) {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'No status selected',
      });
    }

    if (status !== 'verified' && status !== 'unverified') {
      return response.status(400).json({
        status: statusCodes.badRequest,
        error: 'Wrong status selected',
      });
    }

    next();
  }
}
export default UserValidate;

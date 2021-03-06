import help from '../helpers/help';
import data from '../model/usersData';
import statusCodes from '../helpers/statuscodes';
import db from '../migration/database';

/**
 * @class UserController
 *
 * @description Specifies which method handles a given request for a specific endpoint
 *
 * @exports UserController
 */

class UserController {
  /**
   * creates new user
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof UserController
   */

  static async signUp(request, response) {
    const foundUser = await data.searchByEmail(request.body.email);

    if (foundUser.rowCount > 0) {
      return response.status(409).json({
        status: statusCodes.badRequest,
        error: 'email is already taken',
      });
    }

    const result = await data.createUser(request.body);
    const { firstname, lastname, homeaddress, workaddress,
      phonenumber, email, registered, status, isadmin,} = result.rows[0];
    const token = help.jwtToken({ email, isadmin });

    return response.status(201).json({
      status: response.statusCode,
      data: {
        token,
        firstname,
        lastname,
        homeaddress,
        workaddress,
        phonenumber,
        email,
        registered,
        status,
        isadmin,
      },
      message: `Registration Successful ${ firstname }`
    });
  }


  /**
  * @method SignIn
  *
  * @description Logs in a user
  *
  * @param {*} request - The Request Object
  * @param {*} response - - The Request Object
  *
  * @return {} JSON API Response
  */

  static async signIn(request, response) {
    const { email, password } = request.body;
    const result = await data.searchByEmail(email);

    if (result.rowCount < 1 || !help.validatePassword(password, result.rows[0].password)) {
      return response.status(401).json({
        status: response.statusCode,
        error: 'Sorry, the email/password you provided is incorrect',
      });
    }

    const { id, firstname, lastname, isadmin } = result.rows[0];
    const token = help.jwtToken({ id, email, isadmin });

    return response.status(200).json({
      status: statusCodes.success,
      data: [{
        token,
        id,
        firstname,
        lastname,
        email,
      }],
      message: `Login successful ${firstname}`,
    });
  }

  static async verify(request, response) {
    const { email } = request.params;
    const text = 'UPDATE users SET status=$1 WHERE email=$2 RETURNING *;';
    const param = ['verified', email];
    const { rows } = await db.query(text, param);

    if (rows.length === 0) {
      return response.status(404).json({ status: statusCodes.unAuthorized, error: 'User with paramter not found' });
    } 

    response.status(200).json({
      status: 200,
      data: {
        email,
        firstName: rows[0].firstname,
        lastName: rows[0].lastname,
        password: rows[0].password,
        homeAddress: rows[0].homeAddress,
        workAddress: rows[0].workAddress,
        status: rows[0].status,
      },
    });
  }

  static async getUsers(req, res) {
    const { status } = req.query;

    if (typeof status === 'undefined') {
      const { rows } = await db.query('SELECT * FROM users');
      res.status(200).json({
        status: 200,
        data: rows,
      });
    } else {
      const text = 'SELECT * FROM users WHERE status=$1';
      const { rows } = await db.query(text, [status]);
      res.status(200).json({
        status: 200,
        data: rows,
      });
    }
  }
}
export default UserController;

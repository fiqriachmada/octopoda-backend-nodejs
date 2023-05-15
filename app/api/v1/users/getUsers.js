const { Router } = require('express');
const { connection } = require('../database/database');

const getUsers = Router();

getUsers.get('/', async (req, res) => {
  try {
    const itemsPerPage = 10;
    const page = parseInt(req.query.page) || 1; // use query parameter or default to 1
    const offset = (page - 1) * itemsPerPage;
    const userId = req.userId; // retrieve userId from the request object

    const countQuery = 'SELECT COUNT(*) FROM users WHERE id = $1'; // add WHERE clause to count only the logged-in user
    const dataQuery = `SELECT * FROM users WHERE id = $1 ORDER BY id DESC LIMIT ${itemsPerPage} OFFSET ${offset}`; // add WHERE clause to retrieve data only for the logged-in user

    const countResult = await (await connection()).query(countQuery, [userId]);
    const { rows: dataResult } = await (
      await connection()
    ).query(dataQuery, [userId]); // pass userId as a parameter to data query

    const totalCount = countResult.rowCount[0];
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    console.log('countResult', countResult);
    console.log('dataResult', dataResult);
    console.log('totalCount', totalCount);
    console.log('totalPages', totalPages);

    const response = {
      status: res.statusCode,
      data: dataResult,
      meta: {
        pagination: {
          page: page,
          itemsPerPage: itemsPerPage,
          totalCount: totalCount,
          totalPages: totalPages,
          links: {
            ...(page < totalPages
              ? {
                  next: `https://api-harry-potter-app.cyclic.app/users?page=${
                    page + 1
                  }`,
                }
              : {}),
            ...(page > 1 && page <= totalPages
              ? {
                  previous: `https://api-harry-potter-app.cyclic.app/users?page=${
                    page - 1
                  }`,
                }
              : {}),
          },
        },
      },
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response);
    (await connection()).end();
  } catch (err) {
    console.log(err);
    res.status(500).res('Error retrieving users');
  }
});

module.exports = getUsers;

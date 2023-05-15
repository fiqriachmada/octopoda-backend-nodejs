const { Router } = require('express');
const { connection } = require('../database/database');

const getUsers = Router();

getUsers.get('/', async (req, res) => {
  const itemsPerPage = 10;
  const page = parseInt(req.query.page) || 1; // use query parameter or default to 1
  const offset = (page - 1) * itemsPerPage;
  const userId = req.userId; // retrieve userId from the request object

  try {
    const countQuery = 'SELECT COUNT(*) FROM users'; // add WHERE clause to count only the logged-in user
    // const countQuery = 'SELECT COUNT(*) FROM users'; // add WHERE clause to count only the logged-in user
    // const { rows } = await (await connection()).query(countQuery, [userId]);
    const { rows: queryResult } = await (await connection()).query(countQuery);
    console.log('rows', queryResult);

    const dataQuery = `SELECT * FROM users ORDER BY updated_at DESC
    LIMIT $1 OFFSET $2`; // add WHERE clause to retrieve data only for the logged-in user
    // WHERE id = $1
    // ORDER BY id DESC

    const { rows: dataResult } = await (
      await connection()
    ).query(dataQuery, [
      // userId,
      itemsPerPage,
      offset,
    ]); // pass userId as a parameter to data query
    console.log('dataResult', dataResult);

    const totalCount = queryResult[0].count;

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    console.log('totalCount', totalCount);
    console.log('totalPages', totalPages);

    const response = {
      // rows: totalCount,
      // rows,
      status: res.statusCode,
      dataResult,
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
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

module.exports = getUsers;

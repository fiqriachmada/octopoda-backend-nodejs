const { Router } = require('express');
const { connection } = require('../database/database');

const getUsers = Router();

getUsers.get('/', async (req, res) => {
  const itemsPerPage = 10;
  const page = parseInt(req.query.page) || 1; // use query parameter or default to 1
  const offset = (page - 1) * itemsPerPage;

  try {
    const countQuery = 'SELECT COUNT(*) FROM users'; // add WHERE clause to count only the logged-in user
    const { rows: queryResult } = await (await connection()).query(countQuery);

    const dataQuery = `SELECT * FROM users ORDER BY updated_at DESC
    LIMIT $1 OFFSET $2`; // add WHERE clause to retrieve data only for the logged-in user

    const { rows: dataResult } = await (
      await connection()
    ).query(dataQuery, [itemsPerPage, offset]);

    const totalCount = queryResult[0].count;

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const itemsOnLastPage = totalCount % itemsPerPage;

    const response = {
      status: res.statusCode,
      data: dataResult,
      meta: {
        pagination: {
          page: page,
          itemsPerPage: itemsPerPage,
          totalCount: totalCount,
          totalPages: totalPages,
          itemsOnLastPage,
          links: {
            ...(page < totalPages
              ? {
                  next: `https://api-octopoda.glitch.me/users?page=${page + 1}`,
                }
              : {}),
            ...(page > 1 && page <= totalPages
              ? {
                  previous: `https://api-octopoda.glitch.me/users?page=${
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
    // (await connection()).end();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Error retrieving users', error: JSON.stringify(err) });
  }
});

module.exports = getUsers;

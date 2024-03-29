import PostSchema from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostSchema.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5) // достаем последние 5 тегов
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const getPostsByTag = async (req, res) => {
  try {
    const tagName = req.params.tag;
    const posts = await PostSchema.find(
      { "tags": tagName },
    ).populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}


export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const getAllPopularity = async (req, res) => {
  try {
    const posts = await PostSchema.find().sort({ "viewsCount": -1 }).populate('user');

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostSchema.findOneAndUpdate(
      {
        _id: postId, // находим статью по id
      }, {
        $inc: { viewsCount: 1 }, // увеличиваем viewsCount
      },
      {
        returnDocument: 'after', // объясняем что нам нужно вернуть обновленный документ
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json(doc);
      }
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostSchema.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true
        })
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostSchema.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    })
  }
}
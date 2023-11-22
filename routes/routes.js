import { ObjectId } from "@fastify/mongodb";

async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection("projects");

  fastify.get("/todos", async (request, reply) => {
    const result = await collection.find().toArray();
    return result;
  });

  const todoBodyJsonSchema = {
    type: "object",
    required: ["description", "completed"],
    properties: {
      description: { type: "string" },
      completed: { type: "boolean" },
    },
    additionalProperties: false,
  };

  const schema = {
    body: todoBodyJsonSchema,
    response: {
      200: {
        type: "object",
        properties: {
          completed: { type: "boolean" },
          description: { type: "string" },
          _id: { type: "string" },
        },
      },
    },
  };

  fastify.post("/todos", { schema }, async (req, rep) => {
    const todo = req.body;
    todo._id = (await collection.insertOne(todo)).insertedId;
    return todo;
  });

  fastify.get("/todos/:id", async (req, rep) => {
    const result = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      throw new Error("Invalid value");
    }
    return result;
  });

  fastify.delete("/todos/:id", async (req, rep) => {
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    return result.deletedCount > 0;
  });

  const updateTodoSchema = {
    type: "object",
    properties: {
      description: { type: "string" },
      completed: { type: "boolean" },
    },
    additionalProperties: false,
  };

  const patchSchema = {
    body: updateTodoSchema,
  };

  fastify.patch("/todos/:id", { schema: patchSchema }, async (req, rep) => {
    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: { ...req.body },
      },
      {
        returnNewDocument: true,
        returnDocument: "after",
      }
    );
    return result;
  });

  const putTodoSchema = {
    type: "object",
    required: ["description", "completed"],
    properties: {
      description: { type: "string" },
      completed: { type: "boolean" },
      _id: { type: "string" },
    },
    additionalProperties: false,
  };

  const putSchema = {
    body: putTodoSchema,
  };

  fastify.put("/todos/:id", { schema: putSchema }, async (req, rep) => {
    const result = await collection.findOneAndReplace(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        ...req.body,
      },
      {
        returnNewDocument: true,
        returnDocument: "after",
      }
    );
    return result;
  });
}

// module.exports = routes; CommonJS
export default routes; // ESM

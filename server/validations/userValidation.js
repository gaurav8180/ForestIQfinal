const { z } = require("zod");

const userSchema = z.object({
    username: z.string().min(3, "Username should be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password should be at least 6 characters"),
});

module.exports = userSchema;
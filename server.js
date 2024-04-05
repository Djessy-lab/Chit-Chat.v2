const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const childRoutes = require('./routes/childRoutes');
const postRoutes = require('./routes/postRoutes');
const dailyTransmissionRoutes = require('./routes/dailyTransmissionRoutes');
const sharedDocumentRoutes = require('./routes/sharedDocumentRoutes');
const likeRoutes = require('./routes/likeRoutes'); // Importez les routes pour les likes
const commentRoutes = require('./routes/commentRoutes'); // Importez les routes pour les commentaires

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/child', childRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/daily-transmissions', dailyTransmissionRoutes);
app.use('/api/shared-documents', sharedDocumentRoutes);
app.use('/api/posts', likeRoutes);
app.use('/api', commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));

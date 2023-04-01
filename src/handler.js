// buat fungsi dengan nama addNoteHandler

const { nanoid } = require("nanoid");
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
   
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
   
    const newNote = {
      title, tags, body, id, createdAt, updatedAt,
    };
   
    notes.push(newNote);
   
    const isSuccess = notes.filter((note) => note.id === id).length > 0;
   
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId: id,
        },
      });
      response.code(201);
      return response;
    }
    
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });

    response.code(500);
    return response;
};

// mengembalikan data dengan nilai notes di dalamnya
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  }
});

// handler get id
// harus mengembalikan objek catatan secara spesifik berdasarkan id yang digunakan oleh path parameter.
const getNoteByIdHandler = (request, h) => {
  const {id} = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined){
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
// Catatan yang diubah akan diterapkan sesuai dengan id yang digunakan pada route parameter. Jadi, kita perlu mendapatkan nilai id-nya terlebih dahulu.
const {id} = request.params;

//  dapatkan data notes terbaru yang dikirimkan oleh client melalui body request.
const { title, tags, body } = request.payload;

const updatedAt = new Date().toISOString();

const index = notes.findIndex((note) => note.id === id);

if (index !== -1) {
  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil diperbarui',
  });

  response.code(200);
  return response;
}

const response = h.response({
  status: 'fail',
  message: 'Gagal memperbarui catatan. Id tidak ditemukan',
});

response.code(404);
return response;
};

const deleteNoteByIdHandler = (request, h) => {
  // dapatkan dulu nilai id yang dikirim melalui path parameter.
  const { id } = request.params;

  // dapatkan index dari objek catatan sesuai dengan id yang didapat.
  const index = notes.findIndex((note) => note.id === id);

  // Lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1 bila hendak menghapus catatan. Nah, untuk menghapus data pada array berdasarkan index, gunakan method array splice().
  if(index !== 1){
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus, ID tidak ditemukan',
  });

  response.code(404);
  return response;
}

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };
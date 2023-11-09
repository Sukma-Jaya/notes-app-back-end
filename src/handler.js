const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  // logika menyimpan catatan dalam bentuk array
  // client mengirim dalam bentuk json melalui body request
  // dengan pkg hapi gunakan request.payload untuk mendapatkan body request
  const { title, tags, body } = request.payload;

  // menggunakan pkg nanoid untuk mendapatkan kode unik id
  const id = nanoid(16);
  // membuat catatan baru memasukan nilai dari array kedalam notes menggunakan metode push()
  const createAt = new Date().toISOString();
  const updateAt = createAt;

  // memasukan nilai dari array kedalam notes menggunakan metode push()
  const newNote = {
    title, tags, body, id, createAt, updateAt,
  };

  notes.push(newNote);

  // menguji apakah array notes sudah sesuai atau belum dengan manfaatkan metode filter
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

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  // mendapatkan id dari request params
  const { id } = request.params;

  // mendapatkan objek note dengan id dari objek array notes menggunakan method array filter()
  const note = notes.filter((n) => n.id === id)[0];

  // mengembalikan fungsi handler dengan data dan objek note didalamnya
  // pastikan bernilai undefined (kembalikan dengan respon gagal)
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  // mendapatkan nilai id melalui parameter
  const { id } = request.params;

  // mendapatkan data notes terbaru melalui client menggunakan request body
  const { title, tags, body } = request.payload;
  // memperbaharui nilai properti updateAt, menggunakan new Date().ISOString();
  const updatedAt = new Date().toISOString();

  // mendapatkan index array pada array sesuai id yg ditentukan
  const index = notes.findIndex((note) => note.id === id);

  // menentukan gagal tidaknya permintaan melalui index dengan metode if (jika salah index akan -1)
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
  // mendapatkan nilai id melalui parameter
  const { id } = request.params;

  //   // mendapat index objek sesuai id yg didapat
  const index = notes.findIndex((note) => note.id === id);

  // menghapus data array berdasarkan index menggunakan metode splice()
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // bila index -1 kembalikan dengan respon gagal
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};

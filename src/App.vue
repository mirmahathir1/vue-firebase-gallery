<template>
    <div align="center" class="bg-dark" style="min-height:100vh;">
        <b-col lg="4" align="left">

            <b-jumbotron border-variant="secondary" bg-variant="dark" text-variant="light" data-aos="fade-down"
                         class="mb-5">
                <h3>Bootstrap file</h3>
                <b-form-file
                        v-model="file"
                        :state="Boolean(file)"
                        placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here..."
                        @change="fileChanged"
                ></b-form-file>
                <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
                <b-button variant="outline-success" @click="fileSubmit">Submit</b-button>
                <b-progress :value="percentage" :max="100" show-progress animated></b-progress>
                <p>{{message}}</p>

                <b-img v-for="(image,index) in storedImages" :key="index" :src="image.src" height="100" width="100"
                       @click="deleteFile(image.name)"></b-img>
            </b-jumbotron>
        </b-col>
    </div>
</template>
<script>
    import firebase from 'firebase';

    export default {
        data: () => {
            return {
                image: null,
                file: null,
                percentage: 0,
                message: null,

                storedImages: [],
            }
        },

        methods: {
            deleteFile(path) {
                let storageRef = firebase.storage().ref();
                var desertRef = storageRef.child(path);

                // Delete the file
                desertRef.delete().then(() => {
                    // File deleted successfully
                    console.log("Deletion successful");
                    this.loadImages();
                }).catch((error) => {
                    console.log(error);
                });
            },
            fileChanged() {
                console.log("file submitted");
                this.percentage = 0;
            },
            fileSubmit() {
                console.log("Selected files: " + this.file);

                var storage = firebase.storage().ref(this.file.name);

                //upload file
                var upload = storage.put(this.file);

                upload.on(
                    "state_changed",
                    (snapshot) => {
                        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        this.percentage = percentage;
                    },
                    () => {
                        alert("error uploading file");
                    },
                    () => {
                        console.log(this.file.name + " uploaded");
                        this.message = "Completed";
                        // this.getFileUrl(this.file.name);
                        this.loadImages();
                    }
                );

            },
            getFileUrl(filename) {
                //create a storage reference
                let storage = firebase.storage().ref(filename);
                //get file url
                storage
                    .getDownloadURL()
                    .then((url) => {
                        console.log(url);
                        this.image = url;
                    })
                    .catch((error) => {
                        console.log("error encountered");
                    });
            },
            loadImages() {
                //https://firebasestorage.googleapis.com/v0/b/gallery-876f4.appspot.com/o/Screenshot%20from%202020-08-21%2012-42-33.png?alt=media
                let storageRef = firebase.storage().ref();
                var listRef = storageRef.child('/');

                this.storedImages = [];

                listRef.listAll().then((res) => {
                    res.prefixes.forEach((folderRef) => {
                        // All the prefixes under listRef.
                        // You may call listAll() recursively on them.
                        console.log(folderRef);
                    });
                    res.items.forEach((itemRef) => {
                        // All the items under listRef.
                        console.log(itemRef.location.path);
                        this.storedImages.push(
                            {
                                name: itemRef.location.path,
                                src: 'https://firebasestorage.googleapis.com/v0/b/gallery-876f4.appspot.com/o/' + itemRef.location.path + '?alt=media'
                            });
                    });
                }).catch((error) => {
                    console.log(error);
                    // Uh-oh, an error occurred!
                });
            }
        },

        mounted() {
            this.loadImages();
        }

    }
</script>

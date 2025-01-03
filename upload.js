// Upload form submission
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = document.getElementById('token').value;
    const company = document.getElementById('company').value;
    const deadline = document.getElementById('deadline').value;
    const tags = document.getElementById('tags').value;
    const linked_url = document.getElementById('linked_url').value;
    const pdfFile = document.getElementById('pdf_url').files[0];
    const thumbnailFile = document.getElementById('thumbnail_url').files[0];

    // Generate unique timestamp for file names
    const timestamp = new Date().getTime();
    const pdfPath = pdfFile ? `/assets/pdfs/${timestamp}_${company.replace(/\s+/g, '')}.pdf` : ``;
    const thumbnailPath = thumbnailFile ? `/assets/images/${timestamp}_${company.replace(/\s+/g, '')}.png` : ``;

    const repo = 'pfe24-25.github.io';  // Replace with the actual repository name
    const owner = 'pfe24-25';           // Replace with the actual repository owner

    try {
        // Upload PDF and Thumbnail
        if (pdfFile) {
            await uploadFileToGitHub(token, owner, repo, pdfPath, pdfFile);
            console.log(`PDF file uploaded successfully: ${pdfPath}`);
        }
        if (thumbnailFile) {
            await uploadFileToGitHub(token, owner, repo, thumbnailPath, thumbnailFile);
            console.log(`Thumbnail file uploaded successfully: ${thumbnailPath}`);
        }

        // Modify pdfs.js to add the new book entry
        await modifyPdfsJS(token, owner, repo, company, deadline, tags, linked_url, pdfPath, thumbnailPath);
        console.log("New book entry added successfully to pdfs.js");

        // Show success message in UI
        const submit_info = document.getElementById('submit_info');
        submit_info.innerText = "Book added successfully!";
        submit_info.style.color = "#2adf73";
    } catch (error) {
        console.error("Error during upload:", error);

        // Show error message in UI
        const submit_info = document.getElementById('submit_info');
        submit_info.innerText = "Error adding book. Please try again.";
        submit_info.style.color = "#ff5e5e";
    }
});

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get the base64 content without the prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function uploadFileToGitHub(token, owner, repo, path, file) {
    const base64Content = await readFileAsBase64(file);

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add ${file.name}`,
            content: base64Content
        })
    });

    if (!response.ok) {
        throw new Error(`Error uploading file: ${file.name}`);
    }
}

async function modifyPdfsJS(token, owner, repo, company, deadline, tags, linked_url, pdfPath, thumbnailPath) {
    const jsFilePath = '/pdfs.js';

    // Get the existing /pdfs.js file content
    const jsFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents${jsFilePath}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3.raw'  // Get raw content
        }
    });

    if (!jsFileResponse.ok) {
        throw new Error('Error fetching pdfs.js');
    }

    // Get the raw content of pdfs.js as a string (no need to decode from base64)
    const existingContent = await jsFileResponse.text();

    // Add new book data
    const newBookEntry = `
    {
        "company": "${company}",
        "deadline": "${deadline}",
        "Tags": "${tags}",
        "thumbnail_url": "${thumbnailPath}",
        "pdf_url": "${pdfPath}",
        "linked_url": "${linked_url}"
    },`;

    // Insert the new book entry before the closing bracket of the books array
    const updatedContent = existingContent.replace(/(\];\s*)$/, `${newBookEntry}$1`);

    // Fetch the file metadata to get the 'sha' required for updating
    const fileMetadataResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents${jsFilePath}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    });

    const fileMetadata = await fileMetadataResponse.json();
    const sha = fileMetadata.sha;  // Get the SHA of the file

    // Now update the file on GitHub with the modified content
    const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents${jsFilePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add new book for ${company}`,
            content: btoa(unescape(encodeURIComponent(updatedContent))),  // Convert to base64 safely
            sha: sha  // Include the SHA of the file to be updated
        })
    });

    if (!updateResponse.ok) {
        throw new Error("Error updating pdfs.js");
    }
}

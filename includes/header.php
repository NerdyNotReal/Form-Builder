<?php
session_start();
    include ('../backend/db.php');
    $formId = $_GET['formId'];
    
    $sql = "SELECT title From forms where id = '$formId'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
?>
<header class = "header d-flex justify-between align-center pb-2 pi-4 bb bg-neutral-2 text-neutral-94 w-full h-16">
    <div class="header__left d-flex justify-center align-center">
        <div class="header__logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_68_371" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                <rect y="0.5" width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_68_371)">
                <path d="M18.0001 16.2501C18.0001 17.9834 17.3917 19.4584 16.1751 20.6751C14.9584 21.8917 13.4834 22.5001 11.7501 22.5001C10.0167 22.5001 8.54173 21.8917 7.32506 20.6751C6.10839 19.4584 5.50006 17.9834 5.50006 16.2501V7.00006C5.50006 5.75006 5.93756 4.68756 6.81256 3.81256C7.68756 2.93756 8.75006 2.50006 10.0001 2.50006C11.2501 2.50006 12.3126 2.93756 13.1876 3.81256C14.0626 4.68756 14.5001 5.75006 14.5001 7.00006V15.7501C14.5001 16.5167 14.2334 17.1667 13.7001 17.7001C13.1667 18.2334 12.5167 18.5001 11.7501 18.5001C10.9834 18.5001 10.3334 18.2334 9.80006 17.7001C9.26673 17.1667 9.00006 16.5167 9.00006 15.7501V6.50006H11.0001V15.7501C11.0001 15.9667 11.0709 16.1459 11.2126 16.2876C11.3542 16.4292 11.5334 16.5001 11.7501 16.5001C11.9667 16.5001 12.1459 16.4292 12.2876 16.2876C12.4292 16.1459 12.5001 15.9667 12.5001 15.7501V7.00006C12.4834 6.30006 12.2376 5.70839 11.7626 5.22506C11.2876 4.74173 10.7001 4.50006 10.0001 4.50006C9.30006 4.50006 8.70839 4.74173 8.22506 5.22506C7.74173 5.70839 7.50006 6.30006 7.50006 7.00006V16.2501C7.48339 17.4334 7.89173 18.4376 8.72506 19.2626C9.55839 20.0876 10.5667 20.5001 11.7501 20.5001C12.9167 20.5001 13.9084 20.0876 14.7251 19.2626C15.5417 18.4376 15.9667 17.4334 16.0001 16.2501V6.50006H18.0001V16.2501Z" fill="white"/>
                </g>
             </svg>
    </div>
        <span class="workspace-info text-body-regular d-flex align-center gap-1"><span class = "Workspace-title text-neutral-50">My Workspaces</span> / <span class = "form-title medium"><?php
echo $row['title'];
?></span></span>
    </div>

    <div class="header-center">
        <button class="btn btn__primary" title = "Theme">🎨</button>
        <button class="btn btn__primary" title = "Preview">👁️</button>
        <button class="btn btn__primary" title = "Settings">⚙️</button>
    </div>

    <div class="header__right  d-flex gap-4">
        <div class="header__user-avatar d-flex">
            <span class="user-initials rounded text-body-regular bold">EZ</span>
            <span class="user-initials rounded text-body-regular bold">GZ</span>
            <span class="user-initials rounded text-body-regular bold">AU</span>
        </div>

        <div class="header__right--cta">
            <button class="btn btn__secondary">Invite</button>
            <button class="btn btn__primary">Publish</button>
        </div>
    </div>
</header>
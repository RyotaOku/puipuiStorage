import { useState, useEffect, useReducer, useRef, useCallback, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import { showFilesFetch, fileUploadAction, searchFile, fileSize, getUserInformation, CreateNewFolder, deleteFile, changeFileName, showFilesConditionalFetch, starTheFile, allClearAction, logout, changePlan } from './actioncreator'
import { reducer } from './storageReducer'
import Style from '@/styles/puiSto.module.css'

type fileDetail = {
    directoryName: string,
    fileSize: string,
    id: string | number,
    parentDirectory: string,
    directoryType: string,
    extension: string,
    fileType: string,
    convertedDirectoryName: string,
    creation: any,
    modification: any,
    version: any,
    starItem: string,
    formattedFileSize: string,
}

type searchProps = {
    fileList: Array<fileDetail>
}

export default function Main() {
    const [contextMenuState, setContextMenuState] = useState({
        menu: false,
        menuKinds: '',
    })

    const [isEditing, setIsEditing] = useState<{ edit: boolean; fileId: string; fileName: string; fileType: string; editLength: number }>({
        edit: false,
        fileId: '',
        fileName: '',
        fileType: '',
        editLength: 0,
    });

    const [storageUserState, dispatch] = useReducer(reducer, {
        userInformations: []
    })

    const [sortState, setSortState] = useState({
        sortKind: ''
    })

    const [USSRMode, setUSSRMode] = useState(false)

    const [fileStatus, setFileStatus] = useState({
        userId: '',
        nowDirectory: '0',
        parentDirectory: '0',
        selectedDirectoryId: '',
        selectedDirectoryName: '',
        selectedConvertedDirectoryName: '',
        selectedFileType: '',
        condition: '',
        selectedFiles: [] as string[],
        starItem: false,
        convertedCapacity: '',
        capacity: '',
        creation: '',
        modification: ''
    })

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        level: 1,
        category: '',
        title: '',
        action: '',
        cancelMessage: '',
        consentMessage: ''
    })

    const [searchResult, setSearchResult] = useState<{ fileList: fileDetail[] }>({
        fileList: []
    })

    const [topicPath, setTopicPath] = useState<{ path: string[]; pathId: string[] }>({
        path: ['自分のファイル'],
        pathId: ['0']
    });

    const [viewMode, setViewMode] = useState({
        mode: 'middle'
    })

    const [settingState, setSettingState] = useState({
        isShowModal: false,
        plans: false
    })

    const [searchTxt, setSearchTxt] = useState({
        txt: '',
        searching: false
    })

    const [fileDetailState, setFileDetailState] = useState({
        onFileDetail: false,
    })

    const [filePreview, setFilePreview] = useState({
        filePreview: false,
        previewContent: '',
        fileId: '',
        fileName: '',
        scale: false
    })

    const [prevTopicPath, setPrevTopicPath] = useState<{ path: string[]; pathId: string[] }>({
        path: [],
        pathId: []
    });

    const [state2, setState2] = useState<{ fileList: fileDetail[] }>({
        fileList: []
    });

    const [contextState, setContextState] = useState({
        top: 0,
        left: 0,
    })

    const [selected, setSelected] = useState('');

    const [planState, setPlanState] = useState(0)

    function Sort() {
        return (
            <div className={Style.contextMenu} style={{ 'top': contextState.top + 'px', 'left': contextState.left + 'px' }}>
                <ul>
                    <li onClick={() => {
                        setSelected('name')
                        setSortState({
                            ...sortState,
                            sortKind: 'name'
                        })
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                    }}
                        style={{ fontWeight: selected === 'name' ? 'bold' : 'normal' }}>名前</li>
                    <li onClick={() => {
                        setSelected('lastModified')
                        setSortState({
                            ...sortState,
                            sortKind: 'modification'
                        })
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                    }}
                        style={{ fontWeight: selected === 'lastModified' ? 'bold' : 'normal' }}>最終更新日</li>
                    <li onClick={() => {
                        setSelected('fileSize')
                        setSortState({
                            ...sortState,
                            sortKind: 'size'
                        })
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                    }}
                        style={{ fontWeight: selected === 'fileSize' ? 'bold' : 'normal' }}>ファイルサイズ</li>
                    <li onClick={() => {
                        setSelected('fileType')
                        setSortState({
                            ...sortState,
                            sortKind: 'type'
                        })
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                    }}
                        style={{ fontWeight: selected === 'fileType' ? 'bold' : 'normal' }}>ファイル形式</li>
                    <li onClick={() => {
                        setSelected('added')
                        setSortState({
                            ...sortState,
                            sortKind: 'creation'
                        })
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                    }}
                        style={{ fontWeight: selected === 'added' ? 'bold' : 'normal' }}>追加日</li>
                </ul>
            </div>
        )
    }

    function DeleteFile() {
        return (
            <div className={Style.contextMenu} style={{ 'top': contextState.top + 'px', 'left': contextState.left + 'px' }}>
                <ul>
                    <li onClick={async () => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                        setConfirmModal({
                            ...confirmModal,
                            open: true,
                            level: 2,
                            category: 'ファイルの完全削除',
                            title: 'ファイルを削除してもよろしいですか？ゴミ箱から削除すると元には戻せません。',
                            action: 'allClear',
                            cancelMessage: 'いいえ',
                            consentMessage: 'はい'
                        })
                    }}>完全な削除</li>
                    <li onClick={() => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                    }}>詳細</li>
                </ul>
            </div >
        )
    }

    function File() {
        return (
            <div className={Style.contextMenu} style={{ 'top': contextState.top + 'px', 'left': contextState.left + 'px' }}>
                <ul>
                    <li onClick={() => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })

                        if (fileStatus.selectedFileType === 'FOLDER') {
                            const fetchData = async () => {
                                const result = await showFilesFetch(storageUserState.userInformations[0].id, fileStatus.selectedDirectoryId, sortState.sortKind)
                                if (result === undefined) {
                                    return
                                }
                                const fileDetails = result.map((file) => {
                                    return {
                                        directoryName: file.directoryName,
                                        fileSize: file.fileSize,
                                        id: file.id,
                                        parentDirectory: file.parentDirectory,
                                        directoryType: file.directoryType,
                                        extension: file.extension,
                                        fileType: file.fileType,
                                        convertedDirectoryName: file.convertedDirectoryName,
                                        creation: file.creation,
                                        modification: file.modification,
                                        version: file.version,
                                        starItem: file.starItem,
                                        formattedFileSize: file.formattedFileSize
                                    }
                                });
                                setFileDetails(fileDetails);
                            };
                            fetchData();

                            setTopicPath(prevState => ({
                                ...prevState,
                                path: [...prevState.path, fileStatus.selectedDirectoryName],
                                pathId: [...prevState.pathId, fileStatus.selectedDirectoryId]
                            }));
                            return
                        }
                        setFilePreview({
                            ...filePreview,
                            filePreview: true,
                            previewContent: fileStatus.selectedFileType,
                            fileId: fileStatus.selectedDirectoryId,
                            fileName: fileStatus.selectedDirectoryName
                        })
                    }}>{fileStatus.selectedFileType === 'FOLDER' ? 'フォルダーを開く' : 'ファイルを開く'}</li>
                    <li onClick={() => {

                    }}>
                        <a download href={`/api/puiSto/getFile?fileName=${fileStatus.selectedDirectoryId}`} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none', color: '#000' }} className={Style.downloadButton} >
                            ダウンロード</a></li>
                    <li onClick={async () => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                        if (fileStatus.starItem) {
                            setConfirmModal({
                                ...confirmModal,
                                open: true,
                                level: 2,
                                category: 'ファイルの削除',
                                title: 'スター付きのアイテムを削除してもよろしいですか？',
                                action: 'trash',
                                cancelMessage: 'いいえ',
                                consentMessage: 'はい'
                            })
                        } else {
                            setConfirmModal({
                                ...confirmModal,
                                open: true,
                                level: 2,
                                category: 'ファイルの削除',
                                title: 'ファイルを削除してもよろしいですか？ 削除されたアイテムはゴミ箱へ移動されます。',
                                action: 'trash',
                                cancelMessage: 'いいえ',
                                consentMessage: 'はい'
                            })
                        }
                    }}>削除</li>
                    <li onClick={() => {
                    }}>移動</li>
                    <li onClick={() => { }}>コピー</li>
                    <li onClick={async () => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                        starTheFile(fileStatus.selectedDirectoryId, fileStatus.starItem);
                        const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                        if (result === undefined) {
                            return
                        } const fileDetails = result.map((file) => {
                            return {
                                directoryName: file.directoryName,
                                fileSize: file.fileSize,
                                id: file.id,
                                parentDirectory: file.parentDirectory,
                                directoryType: file.directoryType,
                                extension: file.extension,
                                fileType: file.fileType,
                                convertedDirectoryName: file.convertedDirectoryName,
                                creation: file.creation,
                                modification: file.modification,
                                version: file.version,
                                starItem: file.starItem,
                                formattedFileSize: file.formattedFileSize
                            }
                        });
                        setFileDetails(fileDetails);
                    }}>{fileStatus.starItem ? 'スターを外す' : 'スターをつける'}</li>
                    <li onClick={async () => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                        setIsEditing({
                            ...isEditing,
                            edit: true,
                            fileId: fileStatus.selectedDirectoryId,
                            fileName: fileStatus.selectedDirectoryName,
                            fileType: fileStatus.selectedFileType
                        })
                    }}>名前の変更</li>
                    <li onClick={() => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                        setFileDetailState({
                            ...fileDetailState,
                            onFileDetail: true
                        })
                        console.log(fileDetailState.onFileDetail);
                        console.log(fileStatus.convertedCapacity);
                        console.log(fileStatus.capacity);
                    }}>詳細</li>
                </ul>
            </div >
        )
    }

    function SizeMenu() {
        return (
            <div className={Style.contextMenu} style={{ 'top': contextState.top + 'px', 'left': contextState.left + 'px' }}>
                <ul>
                    <li onClick={() => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false
                        })
                        setViewMode({
                            ...viewMode,
                            mode: 'List'
                        })
                    }}>リスト表示</li>
                    <li style={{ 'height': '10px', 'visibility': 'hidden' }} onClick={() => { }}></li>
                    <li onClick={() => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false
                        })
                        setViewMode({
                            ...viewMode,
                            mode: 'Small'
                        })
                    }}>小表示</li>
                    <li onClick={() => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false
                        })
                        setViewMode({
                            ...viewMode,
                            mode: 'Middle'
                        })
                    }}>中表示</li>
                    <li onClick={() => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false
                        })
                        setViewMode({
                            ...viewMode,
                            mode: 'Large'
                        })
                    }}>大表示</li>
                    <li onClick={() => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false
                        })
                        setViewMode({
                            ...viewMode,
                            mode: 'VeryLarge'
                        })
                    }}>特大表示</li>
                </ul>
            </div>
        )
    }

    function Folder() {
        return (
            <div className={Style.contextMenu} style={{ 'top': contextState.top + 'px', 'left': contextState.left + 'px' }}>
                <ul>
                    <li onClick={async () => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                        await CreateNewFolder(fileStatus.nowDirectory, storageUserState.userInformations[0]?.id)
                        const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                        if (result === undefined) {
                            return
                        } const fileDetails = result.map((file) => {
                            return {
                                directoryName: file.directoryName,
                                fileSize: file.fileSize,
                                id: file.id,
                                parentDirectory: file.parentDirectory,
                                directoryType: file.directoryType,
                                extension: file.extension,
                                fileType: file.fileType,
                                convertedDirectoryName: file.convertedDirectoryName,
                                creation: file.creation,
                                modification: file.modification,
                                version: file.version,
                                starItem: file.starItem,
                                formattedFileSize: file.formattedFileSize
                            }
                        });
                        setFileDetails(fileDetails);
                    }}>新規フォルダー</li>
                    <li onClick={() => { }}>詳細</li>
                </ul>
            </div>
        )
    }

    function NewFiles() {
        return (
            <div className={Style.contextMenu} style={{ 'top': contextState.top + 'px', 'left': contextState.left + 'px' }}>
                <ul>
                    <li onClick={() => { }}>新規テキストファイル</li>
                    <li onClick={async () => {
                        setContextMenuState({
                            ...contextMenuState,
                            menu: false,
                        })
                        await CreateNewFolder(fileStatus.nowDirectory, storageUserState.userInformations[0]?.id)
                        const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                        if (result === undefined) {
                            return
                        } const fileDetails = result.map((file) => {
                            return {
                                directoryName: file.directoryName,
                                fileSize: file.fileSize,
                                id: file.id,
                                parentDirectory: file.parentDirectory,
                                directoryType: file.directoryType,
                                extension: file.extension,
                                fileType: file.fileType,
                                convertedDirectoryName: file.convertedDirectoryName,
                                creation: file.creation,
                                modification: file.modification,
                                version: file.version,
                                starItem: file.starItem,
                                formattedFileSize: file.formattedFileSize
                            }
                        });
                        setFileDetails(fileDetails);
                    }}>新規フォルダー</li>
                    <li>
                        <input type="file" ref={fileRef} value={''} id='uploadMenu' style={{ display: 'none' }}
                            onChange={async () => {
                                if (fileRef === null) {
                                    return
                                }
                                if (fileRef.current === null) {
                                    return
                                }
                                if (fileRef.current.files === null) {
                                    return
                                }
                                if (sizeState.maxSize <= (sizeState.nowSize + fileRef.current.files[0].size)) {
                                    setConfirmModal({
                                        ...confirmModal,
                                        open: true,
                                        level: 2,
                                        category: '容量制限です。',
                                        title: '契約プランの制限容量をオーバーしています。',
                                        action: 'overCapacity',
                                        cancelMessage: '戻る',
                                        consentMessage: 'プランを変更',
                                    })
                                    console.log('ファイルサイズ超えるよ！');
                                    return
                                }
                                await fileUploadAction(storageUserState.userInformations[0]?.id, fileRef, fileRef.current?.value.normalize('NFC').replace('C:\\fakepath\\', ''), fileStatus.nowDirectory)

                                const fetchData = async () => {
                                    const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                                    if (result === undefined) {
                                        return
                                    } const fileDetails = result.map((file) => {
                                        return {
                                            directoryName: file.directoryName,
                                            fileSize: file.fileSize,
                                            id: file.id,
                                            parentDirectory: file.parentDirectory,
                                            directoryType: file.directoryType,
                                            extension: file.extension,
                                            fileType: file.fileType,
                                            convertedDirectoryName: file.convertedDirectoryName,
                                            creation: file.creation,
                                            modification: file.modification,
                                            version: file.version,
                                            starItem: file.starItem,
                                            formattedFileSize: file.formattedFileSize
                                        }
                                    });
                                    setFileDetails(fileDetails);
                                };
                                fetchData();
                                setContextMenuState({
                                    ...contextMenuState,
                                    menu: false,
                                })
                            }}
                        />
                        <label htmlFor="uploadMenu" style={{ display: 'block', height: '100%', width: '100%', cursor: 'pointer' }}>その他の新規ファイル</label></li>
                </ul>
            </div>
        )
    }

    function Search(props: searchProps) {
        return (
            <div className={Style.searchResult}>
                {props.fileList.map((v, index: any) => {
                    return <p key={index} className={Style.searchFiles} onDoubleClick={(e) => {
                        if (v.fileType === 'FOLDER') {
                            setTopicPath(prevState => ({
                                ...prevState,
                                path: [...prevState.path, v.directoryName],
                                pathId: [...prevState.pathId, v.id.toString()]
                            }));
                            setSearchTxt({
                                ...searchTxt,
                                searching: false
                            })
                            setFileStatus((fileStatus) => { return { ...fileStatus, nowDirectory: v.id.toString() }; })
                            const fetchData = async () => {
                                const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.selectedDirectoryId, sortState.sortKind)
                                if (result === undefined) {
                                    return
                                } const fileDetails = result.map((file) => {
                                    return {
                                        directoryName: file.directoryName,
                                        fileSize: file.fileSize,
                                        id: file.id,
                                        parentDirectory: file.parentDirectory,
                                        directoryType: file.directoryType,
                                        extension: file.extension,
                                        fileType: file.fileType,
                                        convertedDirectoryName: file.convertedDirectoryName,
                                        creation: file.creation,
                                        modification: file.modification,
                                        version: file.version,
                                        starItem: file.starItem,
                                        formattedFileSize: file.formattedFileSize
                                    }
                                });
                                setFileDetails(fileDetails);
                            };
                            fetchData();
                        } else if (v.fileType !== 'FOLDER') {
                            setSearchTxt({
                                ...searchTxt,
                                searching: false
                            })
                            setFilePreview({
                                ...filePreview,
                                filePreview: true,
                                previewContent: v.fileType,
                                fileId: v.id.toString(),
                                fileName: v.directoryName
                            })
                        }
                    }}><span className={Style.searchPreviewIcon + ' ' + Style[v.fileType.split('/')[0]]}></span>
                        {v.fileType === 'image' && <img src={`/api/puiSto/getFile?fileName=${v.id.toString()}`} alt="" width={'100%'} className={Style.searchPreviewImage} />}
                        {v.parentDirectory === '0' && <span className={Style.root}>Root</span>}<span className={Style.searchFileName}>{v.directoryName}</span></p>
                })}</div>
        )
    }

    const router = useRouter()
    const fileRef = useRef<HTMLInputElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const setFileDetails = useCallback((fileDetails: fileDetail[]) => {
        setState2((prevState) => {
            return { ...prevState, fileList: fileDetails };
        });
    }, []);

    const setSearchFileDetails = useCallback((fileDetails: fileDetail[]) => {
        setSearchResult((prevState) => {
            return { ...prevState, fileList: fileDetails };
        });
    }, []);

    useEffect(() => {
        const userData = async () => {
            const data = await getUserInformation(dispatch)
        }
        userData();
    }, [])

    const [sizeState, setSizeState] = useState({
        maxSize: 0,
        nowSize: 0,
        formattedSize: '',
    })

    const message = {
        open: true,
        level: 2,
        category: 'あぶない！',
        title: `おおっと！あなたのストレージがパンパンだ！大容量で、高速なプランにアップグレード？今すぐに！`,
        action: 'overCapacity',
        cancelMessage: '大丈夫',
        consentMessage: 'プランを確認',
    }

    useEffect(() => {
        if (sizeState.maxSize === 10737418240 && (sizeState.maxSize <= (sizeState.nowSize + 1073741824))) {
            setConfirmModal({
                ...confirmModal,
                ...message
            })
        }
        else if (sizeState.maxSize === 107374182400 && (sizeState.maxSize <= (sizeState.nowSize + 10737418240))) {
            setConfirmModal({
                ...confirmModal,
                ...message
            })
        }
        else if (sizeState.maxSize === 1073741824000 && (sizeState.maxSize <= (sizeState.nowSize + 53687091200))) {
            setConfirmModal({
                ...confirmModal,
                ...message
            })
        }
    }, [])

    useEffect(() => {
        console.log('走る');
        let maxSize = 0
        if (storageUserState.userInformations[0]?.userSelectedPlan === '0') {
            maxSize = 10737418240
        } else if (storageUserState.userInformations[0]?.userSelectedPlan === '1') {
            maxSize = 107374182400
            console.log(sizeState.maxSize);
        } else if (storageUserState.userInformations[0]?.userSelectedPlan === '2') {
            maxSize = 1073741824000
        }
        const updateSizeState = async () => {
            const { a: nowSize, b: formattedSize } = await fileSize(storageUserState.userInformations[0]?.id);

            setSizeState({
                ...sizeState,
                nowSize: nowSize,
                formattedSize: formattedSize,
                maxSize: maxSize
            });
        };
        updateSizeState()



        const fetchData = async () => {
            if (fileStatus.condition === 'rubbish') {
                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'rubbish');
                const fileDetails = result.map((file) => {
                    return {
                        directoryName: file.directoryName,
                        fileSize: file.fileSize,
                        id: file.id,
                        parentDirectory: file.parentDirectory,
                        directoryType: file.directoryType,
                        extension: file.extension,
                        fileType: file.fileType,
                        convertedDirectoryName: file.convertedDirectoryName,
                        creation: file.creation,
                        modification: file.modification,
                        version: file.version,
                        starItem: file.starItem,
                        formattedFileSize: file.formattedFileSize
                    }
                });
                setFileDetails(fileDetails);
                return
            }
            if (fileStatus.condition === 'recently') {
                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'recently');
                const fileDetails = result.map((file) => {
                    return {
                        directoryName: file.directoryName,
                        fileSize: file.fileSize,
                        id: file.id,
                        parentDirectory: file.parentDirectory,
                        directoryType: file.directoryType,
                        extension: file.extension,
                        fileType: file.fileType,
                        convertedDirectoryName: file.convertedDirectoryName,
                        creation: file.creation,
                        modification: file.modification,
                        version: file.version,
                        starItem: file.starItem,
                        formattedFileSize: file.formattedFileSize
                    }
                });
                setFileDetails(fileDetails);
                return
            }
            if (fileStatus.condition === 'star' && fileStatus.nowDirectory === '0') {
                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'star')
                const fileDetails = result.map((file) => {
                    return {
                        directoryName: file.directoryName,
                        fileSize: file.fileSize,
                        id: file.id,
                        parentDirectory: file.parentDirectory,
                        directoryType: file.directoryType,
                        extension: file.extension,
                        fileType: file.fileType,
                        convertedDirectoryName: file.convertedDirectoryName,
                        creation: file.creation,
                        modification: file.modification,
                        version: file.version,
                        starItem: file.starItem,
                        formattedFileSize: file.formattedFileSize
                    }
                });
                setFileDetails(fileDetails);
                return
            }
            const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
            if (result === undefined) {
                return
            }

            const fileDetails = result.map((file) => {
                return {
                    directoryName: file.directoryName,
                    fileSize: file.fileSize,
                    id: file.id,
                    parentDirectory: file.parentDirectory,
                    directoryType: file.directoryType,
                    extension: file.extension,
                    fileType: file.fileType,
                    convertedDirectoryName: file.convertedDirectoryName,
                    creation: file.creation,
                    modification: file.modification,
                    version: file.version,
                    starItem: file.starItem,
                    formattedFileSize: file.formattedFileSize
                }
            });
            setFileDetails(fileDetails);
        };
        fetchData();
    }, [fileStatus, setFileDetails, storageUserState, sortState])

    useEffect(() => {
    }, [prevTopicPath]);

    useEffect(() => {
        if (isEditing.edit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing.edit]);

    useEffect(() => {
    }, [fileStatus.nowDirectory]);

    const [isComposing, setIsComposing] = useState(false);
    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !isComposing) {
            if (isEditing.editLength === 0) {
                setIsEditing({
                    ...isEditing,
                    edit: false
                })
                return
            }
            await changeFileName(isEditing.fileName, fileStatus.selectedDirectoryId, fileStatus.selectedFileType, fileStatus.nowDirectory)
            if (fileStatus.condition === 'rubbish') {
                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'rubbish');
                const fileDetails = result.map((file) => {
                    return {
                        directoryName: file.directoryName,
                        fileSize: file.fileSize,
                        id: file.id,
                        parentDirectory: file.parentDirectory,
                        directoryType: file.directoryType,
                        extension: file.extension,
                        fileType: file.fileType,
                        convertedDirectoryName: file.convertedDirectoryName,
                        creation: file.creation,
                        modification: file.modification,
                        version: file.version,
                        starItem: file.starItem,
                        formattedFileSize: file.formattedFileSize
                    }
                });
                setFileDetails(fileDetails);
                setIsEditing({
                    ...isEditing,
                    edit: false,
                    editLength: 0,
                })
                return
            }
            if (fileStatus.condition === 'star') {
                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'star')
                const fileDetails = result.map((file) => {
                    return {
                        directoryName: file.directoryName,
                        fileSize: file.fileSize,
                        id: file.id,
                        parentDirectory: file.parentDirectory,
                        directoryType: file.directoryType,
                        extension: file.extension,
                        fileType: file.fileType,
                        convertedDirectoryName: file.convertedDirectoryName,
                        creation: file.creation,
                        modification: file.modification,
                        version: file.version,
                        starItem: file.starItem,
                        formattedFileSize: file.formattedFileSize
                    }
                });
                setFileDetails(fileDetails);
                setIsEditing({
                    ...isEditing,
                    edit: false,
                    editLength: 0
                })
                return
            }
            if (fileStatus.condition === '') {
                const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                if (result === undefined) {
                    return
                } const fileDetails = result.map((file) => {
                    return {
                        directoryName: file.directoryName,
                        fileSize: file.fileSize,
                        id: file.id,
                        parentDirectory: file.parentDirectory,
                        directoryType: file.directoryType,
                        extension: file.extension,
                        fileType: file.fileType,
                        convertedDirectoryName: file.convertedDirectoryName,
                        creation: file.creation,
                        modification: file.modification,
                        version: file.version,
                        starItem: file.starItem,
                        formattedFileSize: file.formattedFileSize
                    }
                })
                setFileDetails(fileDetails);
                setIsEditing({
                    ...isEditing,
                    edit: false,
                    editLength: 0
                })
                return
            }
        }
    };
    const handleCompositionStart = () => {
        setIsComposing(true);
    };
    const handleCompositionEnd = () => {
        setIsComposing(false);
    }

    function switchingPage(swithcingId: any) {
        const fetchData = async () => {
            const result = await showFilesFetch(storageUserState.userInformations[0].id, fileStatus.selectedDirectoryId, sortState.sortKind)
            if (result === undefined) {
                return
            } const fileDetails = result.map((file) => {
                return {
                    directoryName: file.directoryName,
                    fileSize: file.fileSize,
                    id: file.id,
                    parentDirectory: file.parentDirectory,
                    directoryType: file.directoryType,
                    extension: file.extension,
                    fileType: file.fileType,
                    convertedDirectoryName: file.convertedDirectoryName,
                    creation: file.creation,
                    modification: file.modification,
                    version: file.version,
                    starItem: file.starItem,
                    formattedFileSize: file.formattedFileSize
                }
            });
            setFileDetails(fileDetails);
        };
        fetchData();
    }

    const [startSelectionX, setStartSelectionX] = useState(0);
    const [startSelectionY, setStartSelectionY] = useState(0);
    const [currentSelectionX, setCurrentSelectionX] = useState(0);
    const [currentSelectionY, setCurrentSelectionY] = useState(0);
    const [isSelecting, setIsSelecting] = useState(false);
    const containerRef = useRef<HTMLTableElement>(null);
    const [selectionBoxRect, setSelectionBoxRect] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    });

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button === 2) {
            return; // 右クリックなら何もしない
        }
        setIsSelecting(true);
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
            const x = event.pageX - containerRect.left;
            const y = event.pageY - containerRect.top;
            setStartSelectionX(x);
            setStartSelectionY(y);
            setCurrentSelectionX(x);
            setCurrentSelectionY(y);
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isSelecting) {
            const containerRect = containerRef.current?.getBoundingClientRect();
            let selectionX = event.pageX - containerRect!.left;
            let selectionY = event.pageY - containerRect!.top;

            if (containerRect) {
                if (selectionX < 0) {
                    selectionX = 0;
                } else if (selectionX > containerRect.width) {
                    selectionX = containerRect.width;
                }

                if (selectionY < 0) {
                    selectionY = 0;
                } else if (selectionY > containerRect.height) {
                    selectionY = containerRect.height;
                }
            }

            setCurrentSelectionX(selectionX);
            setCurrentSelectionY(selectionY);


            const newSelectionBoxRect = {
                left: Math.min(startSelectionX, selectionX),
                top: Math.min(startSelectionY, selectionY),
                width: Math.abs(selectionX - startSelectionX),
                height: Math.abs(selectionY - startSelectionY),
            };

            setSelectionBoxRect(newSelectionBoxRect);
        }
    };

    function handle(modification: string): string {
        // 2023-04-24T05:56:17.437Z
        const date = new Date(modification);
        const time = date.toLocaleTimeString("ja-JP", { hour12: false });
        const nonSecondTime = date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit', hour12: false });

        const jDate = date.toISOString().slice(0, 10).replaceAll('-', '/');
        const nowDate = new Date().toISOString().slice(0, 10).replaceAll('-', '/');
        const nowTime = new Date().toLocaleTimeString("ja-JP", { hour12: false });

        const now = new Date().getTime();
        const modDate = new Date(modification).getTime();
        const diff = now - modDate;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (date.getTime() > new Date().getTime() - (24 * 60 * 60 * 1000)) {
            const diffTime = new Date().getTime() - date.getTime();
            const diffHours = Math.floor(diffTime / (60 * 60 * 1000));
            if (diffHours >= 24) {
                return jDate + ' ' + time;
            } else if (diffHours >= 12) {
                return '昨日 ' + nonSecondTime;
            } else if (diffHours >= 1) {
                return diffHours + '時間前';
            } else {
                const diffMinutes = Math.floor(diffTime / (60 * 1000));
                return diffMinutes + '分前';
            }
        }
        return (
            jDate.toString()
        )
    }

    const handleMouseUp = () => {
        // ドラッグ終了
        setIsSelecting(false);
        setStartSelectionX(0);
        setStartSelectionY(0);
        setCurrentSelectionX(0);
        setCurrentSelectionY(0);
    };

    const handleItemSelect = (index: number) => {
        // アイテムが選択された時の処理
        console.log(`Item ${index} selected`);
    };

    interface SelectionProps {
        startSelectionX: number;
        startSelectionY: number;
        currentSelectionX: number;
        currentSelectionY: number;
        pointerEvents?: 'none' | 'auto' | 'initial' | 'inherit';
    }

    function Selection(props: SelectionProps) {
        const selectionStyles: CSSProperties = {
            left: Math.min(props.startSelectionX, props.currentSelectionX),
            top: Math.min(props.startSelectionY, props.currentSelectionY),
            width: Math.abs(props.startSelectionX - props.currentSelectionX),
            height: Math.abs(props.startSelectionY - props.currentSelectionY),
            position: 'absolute',
            zIndex: 9999,
            border: '1px dashed blue',
            backgroundColor: 'rgba(135, 206, 250, 0.3)',
            pointerEvents: props.pointerEvents || 'none',
        };
        return <div style={selectionStyles} />;
    }

    let table = Style.fileTableMiddle

    switch (viewMode.mode) {
        case 'Middle':
            table = Style.fileTableMiddle
            break
        case 'Small':
            table = Style.fileTableSmall + ' ' + Style.fileTableMiddle
            break
        case 'Large':
            table = Style.fileTableLarge + ' ' + Style.fileTableMiddle
            break
        case 'List':
            table = Style.fileDetail
            break
        case 'VeryLarge':
            table = Style.fileTableVeryLarge + ' ' + Style.fileTableMiddle
            break
    }

    return (
        <div id={USSRMode ? Style.USSR : ''} style={{ 'userSelect': isSelecting ? 'none' : 'auto', minWidth: '1100px' }}>
            {searchTxt.searching && <div className={Style.searchingOverlay} onClick={() => {
                setSearchTxt({
                    ...searchTxt,
                    searching: false
                })
            }}></div>}
            {
                searchTxt.searching && <div className={Style.searchingWrap}>
                    <Search fileList={searchResult.fileList} />
                </div>
            }

            {settingState.isShowModal && <div className={Style.searchingOverlay} onClick={() => {
                setSettingState({
                    ...settingState,
                    isShowModal: false,
                    plans: false
                })
            }}></div>}
            {settingState.isShowModal && <div className={Style.settingWrap}>
                <h2>こんにちは、{storageUserState.userInformations[0]?.userAccountName}さん。</h2>
                {settingState.plans === false &&
                    <>
                        <ul>
                            <li>メールアドレスを変更</li>
                            <li>電話番号を変更</li>
                            <li>名前を変更</li>
                            <li onClick={() => {
                                setSettingState({
                                    ...settingState,
                                    plans: true
                                })
                            }}>プラン内容を変更</li>
                            <li>その他の設定</li>
                        </ul>

                        <button className={Style.ussrButton} onClick={() => {
                            setUSSRMode(USSRMode ? false : true)
                            console.log(USSRMode);

                        }}>ролетарии всех стран, <br /> соединяйтесь! </button>
                    </>
                }
                {settingState.plans &&
                    <>
                        <h3>プランを変更する</h3>
                        <div className={Style.inputWrap}>
                            <input type="radio" id='0' name='plans' onChange={() => {
                                setPlanState(0)
                            }} />
                            <label htmlFor="0">10GBプラン</label>
                            <p className={Style.storageCaution}>{storageUserState.userInformations[0]?.userSelectedPlan === '0' && '現在選択中のプランです。'}</p>
                        </div>
                        <div className={Style.inputWrap}>
                            <input type="radio" id='1' name='plans' onChange={() => {
                                setPlanState(1)
                            }} />
                            <label htmlFor="1">100GBプラン</label>
                            <p className={Style.storageCaution}>{storageUserState.userInformations[0]?.userSelectedPlan === '1' && '現在選択中のプランです。'}</p>
                        </div>
                        <div className={Style.inputWrap}>
                            <input type="radio" id='2' name='plans' onChange={() => {
                                setPlanState(2)
                            }} />
                            <label htmlFor="2">1000GBプラン</label>
                            <p className={Style.storageCaution}>{storageUserState.userInformations[0]?.userSelectedPlan === '2' && '現在選択中のプランです。'}</p>
                        </div>
                        <button className={Style.storageBackButton} onClick={() => {
                            setSettingState({
                                ...settingState,
                                plans: false
                            })
                        }}>戻る</button>
                        <button className={Style.storageChangeButton} onClick={() => {
                            changePlan(storageUserState.userInformations[0]?.id, planState)
                            setSettingState({
                                ...settingState,
                                isShowModal: false,
                                plans: false
                            })
                            let maxSize = 0
                            if (storageUserState.userInformations[0]?.userSelectedPlan === '0') {
                                maxSize = 10737418240
                            } else if (storageUserState.userInformations[0]?.userSelectedPlan === '1') {
                                maxSize = 107374182400
                                console.log(sizeState.maxSize);
                            } else if (storageUserState.userInformations[0]?.userSelectedPlan === '2') {
                                maxSize = 1073741824000
                            }
                            const updateSizeState = async () => {
                                const { a: nowSize, b: formattedSize } = await fileSize(storageUserState.userInformations[0]?.id);

                                setSizeState({
                                    ...sizeState,
                                    nowSize: nowSize,
                                    formattedSize: formattedSize,
                                    maxSize: maxSize
                                });
                            };
                            updateSizeState()
                        }}>プランを変更する</button>
                    </>
                }
            </div>}
            {fileDetailState.onFileDetail &&
                <>
                    <div className={Style.searchingOverlay} onClick={() => {
                        setFileDetailState({
                            ...fileDetailState,
                            onFileDetail: false
                        })
                    }}></div>
                    <div className={Style.detailsWrap}>
                        <h3>ファイルの詳細情報</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>ファイル名</th>
                                    <td>{fileStatus.selectedDirectoryName}</td>
                                </tr>
                                <tr>
                                    <th>種類</th>
                                    <td>{fileStatus.selectedFileType}</td>
                                </tr>
                                <tr>
                                    <th>作成日時</th>
                                    <td>{fileStatus.creation}</td>
                                </tr>
                                <tr>
                                    <th>更新日時</th>
                                    <td>{fileStatus.modification}</td>
                                </tr>
                                <tr>
                                    <th>スター</th>
                                    <td>{fileStatus.starItem ? 'はい' : 'いいえ'}</td>
                                </tr>
                                <tr>
                                    <th>サイズ(ディスク)</th>
                                    <td>{fileStatus.convertedCapacity}</td>
                                </tr>
                                <tr>
                                    <th>サイズ</th>
                                    <td>{fileStatus.capacity}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </>
            }
            <header className={Style.header} style={{ zIndex: searchTxt.searching ? '20' : '0' }}>
                <h1>PuiPui Storage</h1>
                <input type="text" placeholder='検索' value={searchTxt.txt} className={Style.searchForm} onFocus={(e) => {
                    setSearchTxt({
                        ...searchTxt,
                        searching: true
                    })
                }} onChange={async (e) => {
                    setSearchTxt({
                        ...searchTxt,
                        txt: e.target.value
                    })
                    const result = await searchFile(storageUserState.userInformations[0]?.id, e.target.value)
                    if (result === undefined) {
                        return
                    } const fileDetails = result.map((file) => {
                        return {
                            directoryName: file.directoryName,
                            fileSize: file.fileSize,
                            id: file.id,
                            parentDirectory: file.parentDirectory,
                            directoryType: file.directoryType,
                            extension: file.extension,
                            fileType: file.fileType,
                            convertedDirectoryName: file.convertedDirectoryName,
                            creation: file.creation,
                            modification: file.modification,
                            version: file.version,
                            starItem: file.starItem,
                            formattedFileSize: file.formattedFileSize
                        }
                    });
                    setSearchFileDetails(fileDetails);
                }} />
                <button className={Style.logoutButton} onClick={() => {
                    setConfirmModal({
                        ...confirmModal,
                        open: true,
                        level: 2,
                        category: 'ログアウト',
                        title: 'ログアウトします。ファイルにアクセスするには、もう一度ログインする必要があります。',
                        action: 'logout',
                        cancelMessage: '戻る',
                        consentMessage: 'ログアウト'
                    })
                    setSearchTxt({
                        ...searchTxt,
                        searching: false
                    })
                }}></button>
            </header>
            <div className={Style.mainFlexWrap}>
                <div className={Style.leftMenu}>
                    <h2 className={Style.accountName}>{storageUserState.userInformations[0]?.userAccountName}</h2>
                    <ul className={Style.selectMenu}>
                        <li onClick={() => {
                            setFileStatus({
                                ...fileStatus,
                                condition: ''
                            })
                            setFileStatus({
                                ...fileStatus,
                                condition: '',
                                nowDirectory: '0',
                            })
                            setPrevTopicPath({
                                ...prevTopicPath,
                                path: [],
                                pathId: [],
                            })
                            if (topicPath.path[0] === 'スター付きのアイテム' || topicPath.path[0] === 'ごみ箱' || topicPath.path[0] === '最近') {
                                setTopicPath({
                                    ...topicPath,
                                    path: ['自分のファイル'],
                                    pathId: ['0'],
                                });
                            }
                            if (topicPath.path.length > 0) {
                                setTopicPath({
                                    ...topicPath,
                                    path: ['自分のファイル'],
                                    pathId: ['0'],
                                });
                            }
                            const fetchData = async () => {
                                const result = await showFilesFetch(storageUserState.userInformations[0]?.id, '0', sortState.sortKind)
                                if (result === undefined) {
                                    return
                                } const fileDetails = result.map((file) => {
                                    return {
                                        directoryName: file.directoryName,
                                        fileSize: file.fileSize,
                                        id: file.id,
                                        parentDirectory: file.parentDirectory,
                                        directoryType: file.directoryType,
                                        extension: file.extension,
                                        fileType: file.fileType,
                                        convertedDirectoryName: file.convertedDirectoryName,
                                        creation: file.creation,
                                        modification: file.modification,
                                        version: file.version,
                                        starItem: file.starItem,
                                        formattedFileSize: file.formattedFileSize
                                    }
                                });
                                setFileDetails(fileDetails);
                            };
                            fetchData();
                        }} style={{ 'fontWeight': topicPath.path[0] === '自分のファイル' ? 'bold' : 'normal' }}>自分のファイル</li>
                        <li onClick={() => {
                            setPrevTopicPath({
                                ...prevTopicPath,
                                path: [],
                                pathId: []
                            })
                            setTopicPath({
                                ...topicPath,
                                path: ['最近'],
                                pathId: ['']
                            });
                            setFileStatus({
                                ...fileStatus,
                                condition: 'recently',
                                nowDirectory: '0'
                            })
                            const fetchData = async () => {
                                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'recently')
                                const fileDetails = result.map((file) => {
                                    return {
                                        directoryName: file.directoryName,
                                        fileSize: file.fileSize,
                                        id: file.id,
                                        parentDirectory: file.parentDirectory,
                                        directoryType: file.directoryType,
                                        extension: file.extension,
                                        fileType: file.fileType,
                                        convertedDirectoryName: file.convertedDirectoryName,
                                        creation: file.creation,
                                        modification: file.modification,
                                        version: file.version,
                                        starItem: file.starItem,
                                        formattedFileSize: file.formattedFileSize
                                    }
                                });
                                setFileDetails(fileDetails);
                            };
                            fetchData();
                        }} style={{ 'fontWeight': topicPath.path[0] === '最近' ? 'bold' : 'normal' }}>最近</li>
                        <li onClick={() => {
                            setPrevTopicPath({
                                ...prevTopicPath,
                                path: [],
                                pathId: []
                            })
                            setTopicPath({
                                ...topicPath,
                                path: ['スター付きのアイテム'],
                                pathId: ['']
                            });
                            setFileStatus({
                                ...fileStatus,
                                condition: 'star',
                                nowDirectory: '0'
                            })
                            const fetchData = async () => {
                                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'star')
                                const fileDetails = result.map((file) => {
                                    return {
                                        directoryName: file.directoryName,
                                        fileSize: file.fileSize,
                                        id: file.id,
                                        parentDirectory: file.parentDirectory,
                                        directoryType: file.directoryType,
                                        extension: file.extension,
                                        fileType: file.fileType,
                                        convertedDirectoryName: file.convertedDirectoryName,
                                        creation: file.creation,
                                        modification: file.modification,
                                        version: file.version,
                                        starItem: file.starItem,
                                        formattedFileSize: file.formattedFileSize
                                    }
                                });
                                setFileDetails(fileDetails);
                            };
                            fetchData();
                        }} style={{ 'fontWeight': topicPath.path[0] === 'スター付きのアイテム' ? 'bold' : 'normal' }}>スター付きのアイテム</li>
                        <li onClick={() => {
                            setTopicPath({
                                ...topicPath,
                                path: ['ゴミ箱'],
                                pathId: ['']
                            });
                            setFileStatus({
                                ...fileStatus,
                                condition: 'rubbish'
                            })
                            const fetchData = async () => {
                                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'rubbish')
                                const fileDetails = result.map((file) => {
                                    return {
                                        directoryName: file.directoryName,
                                        fileSize: file.fileSize,
                                        id: file.id,
                                        parentDirectory: file.parentDirectory,
                                        directoryType: file.directoryType,
                                        extension: file.extension,
                                        fileType: file.fileType,
                                        convertedDirectoryName: file.convertedDirectoryName,
                                        creation: file.creation,
                                        modification: file.modification,
                                        version: file.version,
                                        starItem: file.starItem,
                                        formattedFileSize: file.formattedFileSize
                                    }
                                });
                                setFileDetails(fileDetails);
                            };
                            fetchData();
                        }} style={{ 'fontWeight': topicPath.path[0] === 'ゴミ箱' ? 'bold' : 'normal' }}>ごみ箱</li>
                    </ul>
                    <div className={Style.storageWrap} onClick={() => {
                        setSettingState({
                            ...settingState,
                            isShowModal: true
                        })
                    }}>
                        <label htmlFor='storage' className={Style.storageLabel}>ストレージ</label>
                        <progress id='storage' value={(sizeState.nowSize / sizeState.maxSize) * sizeState.maxSize} max={sizeState.maxSize} className={Style.storage} style={{ 'background': 'transparent' }}></progress>
                        <p>{sizeState.maxSize.toString().slice(0, -9).replace('7', '0')}GB中 {sizeState.nowSize < 1000 ? sizeState.nowSize : sizeState.formattedSize}使用</p>
                    </div>
                </div>
                <div className={Style.main} onContextMenu={(e) => {
                    e.preventDefault();
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;

                    // 独自の右クリックメニューのサイズを取得（仮の値）
                    const menuWidth = 250;
                    let menuHeight = 92;
                    if (contextMenuState.menuKinds === 'file') {
                        menuHeight = 356
                    }

                    // メニューがはみ出す場合、位置を調整
                    let top = e.clientY;
                    let left = e.clientX;
                    if (e.clientX + menuWidth > windowWidth) {
                        left -= menuWidth;
                    }
                    if (e.clientY + menuHeight > windowHeight) {
                        top -= menuHeight;
                    }
                    setContextState({
                        ...contextState,
                        top,
                        left
                    })
                }
                }>
                    <div className={Style.menuBar}>
                        <div className={Style.menuBar_left}>
                            <button className={Style.createButton} onClick={(e) => {
                                setContextState({
                                    ...contextState,
                                    top: e.currentTarget.offsetTop + 90,
                                    left: e.currentTarget.offsetLeft + 270
                                })
                                setContextMenuState((state) => { return { ...state, menu: true, menuKinds: 'NewFiles' }; })
                            }} style={{ 'display': fileStatus.condition !== '' ? 'none' : 'inline-block' }}>新規</button>
                            <input type="file" ref={fileRef} multiple id='upload' style={{ 'display': 'none' }} value={''} onChange={async () => {
                                if (fileRef === null) {
                                    return
                                }
                                if (fileRef.current === null) {
                                    return
                                }
                                if (fileRef.current.files === null) {
                                    return
                                }
                                if (sizeState.maxSize <= (sizeState.nowSize + fileRef.current.files[0].size)) {
                                    setConfirmModal({
                                        ...confirmModal,
                                        open: true,
                                        level: 2,
                                        category: '容量制限です。',
                                        title: '契約プランの制限容量をオーバーしています。',
                                        action: 'overCapacity',
                                        cancelMessage: '戻る',
                                        consentMessage: 'プランを変更',
                                    })
                                    console.log('ファイルサイズ超えるよ！');
                                    return
                                }
                                await fileUploadAction(storageUserState.userInformations[0]?.id, fileRef, fileRef.current?.value.normalize('NFC').replace('C:\\fakepath\\', ''), fileStatus.nowDirectory)

                                const fetchData = async () => {
                                    const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                                    if (result === undefined) {
                                        return
                                    } const fileDetails = result.map((file) => {
                                        return {
                                            directoryName: file.directoryName,
                                            fileSize: file.fileSize,
                                            id: file.id,
                                            parentDirectory: file.parentDirectory,
                                            directoryType: file.directoryType,
                                            extension: file.extension,
                                            fileType: file.fileType,
                                            convertedDirectoryName: file.convertedDirectoryName,
                                            creation: file.creation,
                                            modification: file.modification,
                                            version: file.version,
                                            starItem: file.starItem,
                                            formattedFileSize: file.formattedFileSize
                                        }
                                    });
                                    setFileDetails(fileDetails);
                                };
                                fetchData();
                            }} />
                            <label htmlFor="upload" className={Style.uploadButton} style={{ 'display': fileStatus.condition !== '' ? 'none' : 'inline-block' }}>アップロード</label>
                        </div>
                        <div className={Style.menuBar_right}>
                            <button className={Style.sort} onClick={(e) => {
                                setContextState({
                                    ...contextState,
                                    top: e.currentTarget.offsetTop + 90,
                                    left: e.currentTarget.offsetLeft + 290
                                })
                                setContextMenuState((state) => { return { ...state, menu: true, menuKinds: 'sort' }; })
                            }}>並べ替え</button>
                            <button className={Style.objectSize} onClick={(e) => {
                                setContextState({
                                    ...contextState,
                                    top: e.currentTarget.offsetTop + 90,
                                    left: e.currentTarget.offsetLeft + 190
                                })
                                setContextMenuState((state) => { return { ...state, menu: true, menuKinds: 'size' }; })
                            }}>表示</button>
                        </div>
                    </div>
                    <div className={Style.topicsWrap}>
                        <div className={Style.topicsInner}>
                            <button className={Style.backButton} style={{
                                background: topicPath.pathId.length < 2 ? '#8ccfe4' : '',
                                boxShadow: topicPath.pathId.length < 2 ? '0px 8px 8px 5px #8fb1e8 inset' : ''
                            }} onClick={() => {
                                if (topicPath.pathId.length < 2) {
                                    // パンくずリストが2未満の場合の処理
                                    return;
                                }
                                setPrevTopicPath({
                                    ...prevTopicPath,
                                    path: [...prevTopicPath.path, topicPath.path[topicPath.path.length - 1]],
                                    pathId: [...prevTopicPath.pathId, topicPath.pathId[topicPath.pathId.length - 1]],
                                })
                                const newTopicPath = {
                                    path: topicPath.path.slice(0, -1),
                                    pathId: topicPath.pathId.slice(0, -1)
                                };
                                setTopicPath(newTopicPath);
                                switchingPage(newTopicPath.pathId[newTopicPath.pathId.length - 1]);
                                if (topicPath.pathId.slice(1).includes('0')) {
                                    setTopicPath({
                                        ...topicPath,
                                        path: ['自分のファイル'],
                                        pathId: ['0']
                                    });
                                }
                                setFileStatus({
                                    ...fileStatus,
                                    nowDirectory: (newTopicPath.pathId[newTopicPath.pathId.length - 1]).toString()
                                })
                            }}></button>
                            <button className={Style.forwardButton} style={{
                                background: prevTopicPath.pathId.length === 0 ? '#8ccfe4' : '',
                                boxShadow: prevTopicPath.pathId.length === 0 ? '0px 8px 8px 5px #8fb1e8 inset' : ''
                            }}
                                onClick={() => {
                                    if (prevTopicPath.pathId.length === 0) {
                                        // パンくずリストが2未満の場合の処理
                                        return;
                                    }
                                    switchingPage(prevTopicPath.pathId[prevTopicPath.pathId.length - 1])
                                    const newTopicPath = {
                                        path: prevTopicPath.path.slice(0, -1),
                                        pathId: prevTopicPath.pathId.slice(0, -1)
                                    };
                                    setTopicPath({
                                        ...topicPath,
                                        path: [...topicPath.path, prevTopicPath.path.slice(-1)[0]],
                                        pathId: [...topicPath.pathId, prevTopicPath.pathId.slice(-1)[0]]
                                    });
                                    setPrevTopicPath(newTopicPath);
                                    setFileStatus({
                                        ...fileStatus,
                                        nowDirectory: (prevTopicPath.pathId.slice(-1)[0]).toString()
                                    })
                                    switchingPage(prevTopicPath.pathId[prevTopicPath.pathId.length - 1]);
                                }}></button>
                            {topicPath.path.map((directory, index) => (
                                <div key={index} >
                                    <p
                                        className={Style.topics}
                                        data-id={topicPath.pathId[index]}
                                        onClick={(e) => {
                                            if (topicPath.pathId.length === 0 && e.currentTarget.dataset.id === '0') {
                                                return
                                            }
                                            if (fileStatus.nowDirectory === (topicPath.pathId[index]).toString()) {
                                                return
                                            }
                                            setPrevTopicPath({
                                                ...prevTopicPath,
                                                path: [...prevTopicPath.path, directory],
                                                pathId: [...prevTopicPath.pathId, e.currentTarget.dataset.id === undefined ? '' : e.currentTarget.dataset.id.toString()],
                                            })
                                            setFileStatus({
                                                ...fileStatus,
                                                nowDirectory: e.currentTarget.dataset.id === undefined ? '0' : e.currentTarget.dataset.id.toString()
                                            })
                                            switchingPage(e.currentTarget.dataset.id)
                                            setTopicPath({
                                                path: topicPath.path.slice(0, index + 1),
                                                pathId: topicPath.pathId.slice(0, index + 1),
                                            });
                                        }}
                                    >
                                        {directory}
                                    </p>
                                    {fileStatus.condition === 'rubbish' && <button className={Style.allClear} onClick={async () => {
                                        const aa = document.getElementsByClassName(Style.fileTableMiddle)[0]?.getElementsByTagName('td')[0]
                                        const bb = document.getElementsByClassName(Style.fileDetail)[0]?.getElementsByTagName('td')[0]
                                        if (aa === undefined && bb === undefined) {
                                            return
                                        }
                                        setConfirmModal({
                                            ...confirmModal,
                                            open: true,
                                            level: 2,
                                            category: 'ファイルの削除',
                                            title: 'ゴミ箱を空にしますか？ ゴミ箱から削除したファイルは、復元できません。よろしいですか？',
                                            action: 'allClear',
                                            cancelMessage: 'いいえ',
                                            consentMessage: 'はい'
                                        })
                                    }}>ゴミ箱を空にする</button>}
                                    {index < topicPath.path.length - 1 && <span className={Style.topicsSymbol}> ＞ </span>}
                                </div>
                            ))}

                        </div>
                    </div>


                    <table className={table}
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}>
                        <tbody onContextMenu={(e) => {
                            console.log((e.target as Element).tagName);

                            if ((e.target as Element).tagName === 'DIV' ||
                                (e.target as Element).tagName === 'SPAN' ||
                                (e.target as Element).tagName === 'IMG' ||
                                (e.target as Element).tagName === 'TD' ||
                                (e.target as Element).tagName === 'P') {
                                return
                            }
                            setContextMenuState({ ...contextMenuState, menu: true, menuKinds: 'folder' })
                        }}>
                            <tr>
                                {state2.fileList.map((file: fileDetail, index: any) => {
                                    return (
                                        <td key={file.id} className={file.starItem ? Style.starItem : ''} data-id={file.id} onContextMenu={(e) => {
                                            if (fileStatus.condition === 'rubbish') {
                                                setContextMenuState((state) => { return { ...state, menu: true, menuKinds: 'deleteFile' }; })
                                            } else {
                                                setContextMenuState((state) => { return { ...state, menu: true, menuKinds: 'file' }; })
                                            }
                                            const date = new Date(file.creation);
                                            const jDate = date.toISOString().slice(0, 10).replaceAll('-', '/');
                                            const nonSecondTime = date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                                            const mDate = new Date(file.modification);
                                            const mjDate = mDate.toISOString().slice(0, 10).replaceAll('-', '/');
                                            const mNonSecondTime = mDate.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                                            setFileStatus((fileStatus) => {
                                                return {
                                                    ...fileStatus,
                                                    selectedDirectoryId: file.id.toString(),
                                                    selectedDirectoryName: file.directoryName,
                                                    selectedFileType: file.fileType,
                                                    starItem: file.starItem ? true : false,
                                                    convertedCapacity: file.formattedFileSize,
                                                    capacity: file.fileSize,
                                                    creation: jDate + ' ' + nonSecondTime,
                                                    modification: mjDate + ' ' + mNonSecondTime
                                                };
                                            })
                                            if (file.fileType === 'FOLDER') {
                                                setContextMenuState((state) => { return { ...state, menu: true, menuKinds: 'file' }; })
                                                setFileStatus((prevFileStatus) => {
                                                    const newFileStatus = {
                                                        ...prevFileStatus,
                                                        parentDirectory: prevFileStatus.nowDirectory,
                                                        selectedDirectoryId: file.id.toString(),
                                                        selectedDirectoryName: file.directoryName,
                                                        selectedFileType: file.fileType,
                                                        starItem: file.starItem === 'true' ? true : false
                                                    };

                                                    return newFileStatus;
                                                });
                                            }
                                        }}
                                            onDoubleClick={async (e) => {
                                                if (file.fileType === 'FOLDER' &&
                                                    !(e.target as Element).classList.contains(Style.directoryName)) {
                                                    setTopicPath(prevState => ({
                                                        ...prevState,
                                                        path: [...prevState.path, file.directoryName],
                                                        pathId: [...prevState.pathId, file.id.toString()]
                                                    }));
                                                    console.log(e.target);
                                                    setFileStatus((fileStatus) => { return { ...fileStatus, nowDirectory: file.id.toString() }; })
                                                    const fetchData = async () => {
                                                        const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                                                        if (result === undefined) {
                                                            return
                                                        } const fileDetails = result.map((file) => {
                                                            return {
                                                                directoryName: file.directoryName,
                                                                fileSize: file.fileSize,
                                                                id: file.id,
                                                                parentDirectory: file.parentDirectory,
                                                                directoryType: file.directoryType,
                                                                extension: file.extension,
                                                                fileType: file.fileType,
                                                                convertedDirectoryName: file.convertedDirectoryName,
                                                                creation: file.creation,
                                                                modification: file.modification,
                                                                version: file.version,
                                                                starItem: file.starItem,
                                                                formattedFileSize: file.formattedFileSize
                                                            }
                                                        });
                                                        setFileDetails(fileDetails);
                                                    };
                                                    fetchData();
                                                } else if ((e.target as Element).tagName !== 'SPAN') {
                                                    setFilePreview({
                                                        ...filePreview,
                                                        filePreview: true,
                                                        previewContent: file.fileType,
                                                        fileId: file.id.toString(),
                                                        fileName: file.directoryName
                                                    })
                                                }
                                            }}>
                                            <div className={Style[file.fileType.split('/')[0]]}>
                                                {file.fileType === 'image' && <img src={`/api/puiSto/getFile?fileName=${file.id.toString()}`} alt="" width={'100%'} className={Style.previewImage} />}
                                                {file.extension === 'pdf' && <iframe
                                                    className={Style.pdfIframe}
                                                    src={`/api/puiSto/getFile?fileName=${file.id.toString()}#toolbar=0&navpanes=0&view=FitV&scrollbar=0`}
                                                    style={{
                                                    }}
                                                    allowFullScreen
                                                ></iframe>}
                                            </div>
                                            {/* <input type="checkbox" className={Style.check} id='check'/> */}
                                            {/* <label htmlFor="check" className={Style.checkLabel}></label> */}
                                            <p data-id={file.id.toString()} data-name={file.directoryName} onDoubleClick={() => {
                                                setFileStatus({
                                                    ...fileStatus,
                                                    selectedDirectoryId: file.id.toString(),
                                                    selectedFileType: file.fileType
                                                })
                                            }}>
                                                {viewMode.mode !== 'List' && file.directoryName.length > 13 && <div className={Style.tooltip}>{file.directoryName}</div>}
                                                {isEditing.edit && isEditing.fileId === file.id.toString() ? <input type='text' ref={inputRef} value={isEditing.fileName}
                                                    size={viewMode.mode === 'List' ? isEditing.fileName.length * 2 : 0}
                                                    onChange={(e) => {
                                                        setIsEditing({
                                                            ...isEditing,
                                                            fileName: e.target.value,
                                                            editLength: isEditing.editLength + 1
                                                        })
                                                    }}
                                                    onBlur={async () => {
                                                        if (isEditing.editLength === 0) {
                                                            setIsEditing({
                                                                ...isEditing,
                                                                edit: false,
                                                            })
                                                            return
                                                        }
                                                        await changeFileName(isEditing.fileName, fileStatus.selectedDirectoryId, fileStatus.selectedFileType, fileStatus.nowDirectory)
                                                        if (fileStatus.condition === 'rubbish') {
                                                            const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'rubbish');
                                                            const fileDetails = result.map((file) => {
                                                                return {
                                                                    directoryName: file.directoryName,
                                                                    fileSize: file.fileSize,
                                                                    id: file.id,
                                                                    parentDirectory: file.parentDirectory,
                                                                    directoryType: file.directoryType,
                                                                    extension: file.extension,
                                                                    fileType: file.fileType,
                                                                    convertedDirectoryName: file.convertedDirectoryName,
                                                                    creation: file.creation,
                                                                    modification: file.modification,
                                                                    version: file.version,
                                                                    starItem: file.starItem,
                                                                    formattedFileSize: file.formattedFileSize
                                                                }
                                                            });
                                                            setFileDetails(fileDetails);
                                                            setIsEditing({
                                                                ...isEditing,
                                                                edit: false,
                                                                editLength: 0
                                                            })
                                                            return
                                                        }
                                                        if (fileStatus.condition === 'star') {
                                                            const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'star')
                                                            const fileDetails = result.map((file) => {
                                                                return {
                                                                    directoryName: file.directoryName,
                                                                    fileSize: file.fileSize,
                                                                    id: file.id,
                                                                    parentDirectory: file.parentDirectory,
                                                                    directoryType: file.directoryType,
                                                                    extension: file.extension,
                                                                    fileType: file.fileType,
                                                                    convertedDirectoryName: file.convertedDirectoryName,
                                                                    creation: file.creation,
                                                                    modification: file.modification,
                                                                    version: file.version,
                                                                    starItem: file.starItem,
                                                                    formattedFileSize: file.formattedFileSize
                                                                }
                                                            });
                                                            setFileDetails(fileDetails);
                                                            setIsEditing({
                                                                ...isEditing,
                                                                edit: false,
                                                                editLength: 0
                                                            })
                                                            return
                                                        }
                                                        if (fileStatus.condition === '') {
                                                            const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                                                            if (result === undefined) {
                                                                return
                                                            } const fileDetails = result.map((file) => {
                                                                return {
                                                                    directoryName: file.directoryName,
                                                                    fileSize: file.fileSize,
                                                                    id: file.id,
                                                                    parentDirectory: file.parentDirectory,
                                                                    directoryType: file.directoryType,
                                                                    extension: file.extension,
                                                                    fileType: file.fileType,
                                                                    convertedDirectoryName: file.convertedDirectoryName,
                                                                    creation: file.creation,
                                                                    modification: file.modification,
                                                                    version: file.version,
                                                                    starItem: file.starItem,
                                                                    formattedFileSize: file.formattedFileSize
                                                                }
                                                            })
                                                            setFileDetails(fileDetails);
                                                            setIsEditing({
                                                                ...isEditing,
                                                                edit: false,
                                                                editLength: 0
                                                            })
                                                            return
                                                        }
                                                    }}
                                                    onKeyDown={
                                                        handleKeyDown
                                                    }
                                                    onCompositionStart={handleCompositionStart}
                                                    onCompositionEnd={handleCompositionEnd} /> : <span className={Style.directoryName} onDoubleClick={() => {
                                                        setIsEditing({
                                                            ...isEditing,
                                                            edit: true,
                                                            fileId: file.id.toString(),
                                                            fileName: file.directoryName
                                                        })
                                                    }}>{file.directoryName}</span>}
                                                <span className={Style.modification}>{handle(file.modification)}</span></p>
                                        </td>
                                    )
                                })}
                            </tr>

                        </tbody>

                        {isSelecting && (
                            <Selection
                                startSelectionX={startSelectionX}
                                startSelectionY={startSelectionY}
                                currentSelectionX={currentSelectionX}
                                currentSelectionY={currentSelectionY}
                            />
                        )}
                    </table>
                </div>
            </div >
            {
                contextMenuState.menu && contextMenuState.menuKinds === 'sort' &&
                <Sort />
            }
            {
                contextMenuState.menu && contextMenuState.menuKinds === 'folder' &&
                <Folder />
            }
            {
                contextMenuState.menu && contextMenuState.menuKinds === 'size' &&
                <SizeMenu />
            }
            {
                contextMenuState.menu && contextMenuState.menuKinds === 'file' &&
                <File />
            }
            {
                contextMenuState.menu && contextMenuState.menuKinds === 'deleteFile' &&
                <DeleteFile />
            }
            {
                contextMenuState.menu && contextMenuState.menuKinds === 'NewFiles' &&
                <NewFiles />
            }
            {
                contextMenuState.menu && <div className={Style.overlay} onClick={() => {
                    setContextMenuState({
                        ...contextMenuState,
                        menu: false
                    })
                }}></div>
            }
            {
                confirmModal.open &&
                <div className={Style.confOverlay}>
                    <div className={Style.confModalWrap}>
                        <h2 className={Style.modalTitle} style={{ 'background': confirmModal.level === 1 ? '#0078d4' : '#cd3c3c' }}>{confirmModal.category}</h2>
                        <p className={Style.modalMessage}>{confirmModal.title}</p>
                        <div className={Style.modalImage}></div>
                        <button className={Style.confirmCancelButton + ' ' + Style.confirmButton} onClick={() => {
                            setConfirmModal({
                                ...confirmModal,
                                open: false,
                                level: 1,
                                category: '',
                                title: '',
                                action: '',
                                cancelMessage: '',
                                consentMessage: ''
                            })
                        }}>{confirmModal.cancelMessage}</button>
                        <button className={Style.confirmConsentButton + ' ' + Style.confirmButton} style={{ 'background': confirmModal.level === 1 ? '#0078d4' : '#cd3c3c' }} onClick={async () => {
                            setConfirmModal({
                                ...confirmModal,
                                open: false,
                                level: 1,
                                category: '',
                                title: '',
                                action: '',
                                cancelMessage: '',
                                consentMessage: ''
                            })
                            if (confirmModal.action === 'trash') {
                                await deleteFile(fileStatus.selectedDirectoryName, fileStatus.selectedDirectoryId)
                                const fetchData = async () => {
                                    console.log('reguif-----------');
                                    if (fileStatus.condition === 'rubbish') {
                                        const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'rubbish');
                                        const fileDetails = result.map((file) => {
                                            return {
                                                directoryName: file.directoryName,
                                                fileSize: file.fileSize,
                                                id: file.id,
                                                parentDirectory: file.parentDirectory,
                                                directoryType: file.directoryType,
                                                extension: file.extension,
                                                fileType: file.fileType,
                                                convertedDirectoryName: file.convertedDirectoryName,
                                                creation: file.creation,
                                                modification: file.modification,
                                                version: file.version,
                                                starItem: file.starItem,
                                                formattedFileSize: file.formattedFileSize
                                            }
                                        });
                                        setFileDetails(fileDetails);
                                        return
                                    }
                                    if (fileStatus.condition === 'recently') {
                                        const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'recently');
                                        const fileDetails = result.map((file) => {
                                            return {
                                                directoryName: file.directoryName,
                                                fileSize: file.fileSize,
                                                id: file.id,
                                                parentDirectory: file.parentDirectory,
                                                directoryType: file.directoryType,
                                                extension: file.extension,
                                                fileType: file.fileType,
                                                convertedDirectoryName: file.convertedDirectoryName,
                                                creation: file.creation,
                                                modification: file.modification,
                                                version: file.version,
                                                starItem: file.starItem,
                                                formattedFileSize: file.formattedFileSize
                                            }
                                        });
                                        setFileDetails(fileDetails);
                                        return
                                    }
                                    if (fileStatus.condition === 'star' && fileStatus.nowDirectory === '0') {
                                        const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'star')
                                        const fileDetails = result.map((file) => {
                                            return {
                                                directoryName: file.directoryName,
                                                fileSize: file.fileSize,
                                                id: file.id,
                                                parentDirectory: file.parentDirectory,
                                                directoryType: file.directoryType,
                                                extension: file.extension,
                                                fileType: file.fileType,
                                                convertedDirectoryName: file.convertedDirectoryName,
                                                creation: file.creation,
                                                modification: file.modification,
                                                version: file.version,
                                                starItem: file.starItem,
                                                formattedFileSize: file.formattedFileSize
                                            }
                                        });
                                        setFileDetails(fileDetails);
                                        return
                                    }
                                    if (fileStatus.condition === '') {
                                        console.log('tintin!!!!!!!!!!!!!');
                                        const result = await showFilesFetch(storageUserState.userInformations[0]?.id, fileStatus.nowDirectory, sortState.sortKind)
                                        if (result === undefined) {
                                            return
                                        }
                                        const fileDetails = result.map((file) => {
                                            return {
                                                directoryName: file.directoryName,
                                                fileSize: file.fileSize,
                                                id: file.id,
                                                parentDirectory: file.parentDirectory,
                                                directoryType: file.directoryType,
                                                extension: file.extension,
                                                fileType: file.fileType,
                                                convertedDirectoryName: file.convertedDirectoryName,
                                                creation: file.creation,
                                                modification: file.modification,
                                                version: file.version,
                                                starItem: file.starItem,
                                                formattedFileSize: file.formattedFileSize
                                            }
                                        });
                                        setFileDetails(fileDetails);
                                        return
                                    }
                                }
                                fetchData()
                            }
                            if (confirmModal.action === 'nameError') {
                                return
                            }
                            if (confirmModal.action === 'allClear') {
                                await allClearAction(storageUserState.userInformations[0]?.id)
                                const result = await showFilesConditionalFetch(storageUserState.userInformations[0]?.id, 'rubbish');
                                const fileDetails = result.map((file) => {
                                    return {
                                        directoryName: file.directoryName,
                                        fileSize: file.fileSize,
                                        id: file.id,
                                        parentDirectory: file.parentDirectory,
                                        directoryType: file.directoryType,
                                        extension: file.extension,
                                        fileType: file.fileType,
                                        convertedDirectoryName: file.convertedDirectoryName,
                                        creation: file.creation,
                                        modification: file.modification,
                                        version: file.version,
                                        starItem: file.starItem,
                                        formattedFileSize: file.formattedFileSize
                                    }
                                });
                                setFileDetails(fileDetails);
                                return
                            }
                            if (confirmModal.action === 'starDelete') {
                                return
                            }
                            if (confirmModal.action === 'logout') {
                                await logout(storageUserState.userInformations[0]?.id)
                                window.location.href = '/oku/0029';
                                return
                            }
                            if (confirmModal.action === 'overCapacity') {
                                setSettingState({
                                    ...settingState,
                                    isShowModal: true,
                                    plans: true
                                })
                                return
                            }
                        }
                        }>{confirmModal.consentMessage}</button>
                    </div>
                </div>
            }
            {
                filePreview.filePreview &&
                <>
                    <div className={Style.fullPreviewWrap}>
                        <header>
                            <h1>{filePreview.fileName}</h1>
                            <a download={filePreview.fileName} href={`/api/puiSto/getFile?fileName=${filePreview.fileId}`} className={Style.downloadButton} onClick={() => {
                            }}>ダウンロード</a>
                            <button className={Style.closeButton} onClick={() => {
                                setFilePreview({
                                    ...filePreview,
                                    filePreview: false,
                                })
                            }}></button>
                        </header>
                        {filePreview.previewContent === 'image' &&
                            <div>
                                <img
                                    src={`/api/puiSto/getFile?fileName=${filePreview.fileId}`}
                                    alt=""
                                    className={Style.fullPreviewImage}
                                    // style={{
                                    //   transform: filePreview.scale ? 'scale(3)' : 'scale(1)',
                                    //   cursor: filePreview.scale ? 'zoom-out' : 'zoom-in',
                                    // }}
                                    onClick={(e) => {
                                        // クリックされた座標を取得
                                        const offsetX = e.nativeEvent.offsetX;
                                        const offsetY = e.nativeEvent.offsetY;

                                        // transform-originを設定
                                        const imageElement = e.target as HTMLImageElement;
                                        imageElement.style.transformOrigin = `${offsetX}px ${offsetY}px`;

                                        setFilePreview({
                                            ...filePreview,
                                            scale: filePreview.scale ? false : true,
                                        });
                                    }}
                                    style={{
                                        transform: filePreview.scale ? 'scale(3.5)' : 'scale(1)',
                                        cursor: filePreview.scale ? 'zoom-out' : 'zoom-in',
                                    }}
                                />

                            </div>
                        }
                        {filePreview.previewContent === 'pdf' &&
                            <iframe src={`/api/puiSto/getFile?fileName=${filePreview.fileId}#toolbar=0&navpanes=0&view=Fit&scrollbar=0`} className={Style.fullPreviewPdf}></iframe>
                        }
                        {filePreview.previewContent !== 'pdf' && filePreview.previewContent !== 'image' &&
                            <>
                                <div className={Style[filePreview.previewContent] + ' ' + Style.previewIcon}></div>
                                <p>このファイルには表示できるプレビューがありません。<br />
                                    表示したい場合には、ファイルをダウンロードしてください。</p>
                                <a download href={`/api/puiSto/getFile?fileName=${filePreview.fileId}`} className={Style.downloadButton} style={{ margin: '20px auto 0' }} onClick={() => {
                                }}>ダウンロード</a>
                            </>
                        }
                    </div>
                </>
            }
        </div >
    )
}
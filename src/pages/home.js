import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { Button, message, notification } from 'antd';

const { ipcRenderer } = window;
export default () => {
  useEffect(() => {
    // 版本变更
    ipcRenderer.on('version-has-changed', (event, remoteVersion) => {
      notification.warn({
        message: '版本检测',
        description: `当前最新版本：${remoteVersion}`,
        duration: 3,
      });
    });

    // 版本未变更
    ipcRenderer.on('version-never-change', event => {
      notification.success({
        message: '版本检测完成',
        description: '已是最新版本',
        duration: 1.5,
      });
    });

    // 下载更新进度
    ipcRenderer.on('downloadProgress', (event, progress) => {
      console.log(progress);
    });

    // 下载更新完成
    ipcRenderer.on('downloaded', () => {
      notification.success({
        message: '下载完成',
        duration: 3,
      });
    });
    return () => {
      // 移除监听事件 preload.js
      ipcRenderer.removeEvents([
        'version-has-changed',
        'version-never-change',
        'downloaded',
        'downloadProgress'
      ]);
    };
  });

  const down = () => {
    // 下载版本
    ipcRenderer.send('downloadForUpdate');
  }

  // 检测版本
  const check = () => {
    ipcRenderer.send('checkForUpdate');
  }

  return <div className={styles.main}>
    Home
    <Button onClick={() => message.warn('消息内容')}>按钮</Button>
    <Button onClick={() => check()}>检查更新</Button>
    <Button onClick={() => down()}>下载更新</Button>
  </div>;
};
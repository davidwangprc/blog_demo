"use client";

import React from "react";
import styles from "./Pagination.module.css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Pagination = ({ page, pageCount, baseUrl = '' }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = (newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage);
        return params.toString();
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pageCount) return;
        
        const url = baseUrl || pathname;
        router.push(`${url}?${createQueryString(newPage)}`);
    };

    return (
        <div className={styles.container}>
            <button
                className={styles.button}
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
            >
                上一页
            </button>
            <span className={styles.pageInfo}>
                {page} / {pageCount || 1}
            </span>
            <button
                className={styles.button}
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pageCount}
            >
                下一页
            </button>
        </div>
    );
};

export default Pagination;